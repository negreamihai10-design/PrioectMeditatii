import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestPayload {
  tutor_id: string;
  student_name: string;
  student_email: string;
  subject_name: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const payload: RequestPayload = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: tutorProfile } = await supabase
      .from("tutor_profiles")
      .select("email, name")
      .eq("id", payload.tutor_id)
      .maybeSingle();

    if (!tutorProfile?.email) {
      return new Response(
        JSON.stringify({ success: false, error: "Tutor email not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    const appUrl = Deno.env.get("APP_URL") || "https://meditatiipro.ro";
    const requestsUrl = `${appUrl}/cereri`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h1 style="color: #0f524d; border-bottom: 3px solid #08c4ae; padding-bottom: 12px;">
    Cerere noua de intalnire
  </h1>

  <p style="font-size: 16px; line-height: 1.6;">
    Buna ${tutorProfile.name},
  </p>

  <p style="font-size: 16px; line-height: 1.6;">
    Un elev doreste sa se intalneasca cu tine pentru <strong>${payload.subject_name}</strong>.
  </p>

  <h2 style="color: #087e74; margin-top: 24px;">Informatii elev</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 12px; font-weight: bold; width: 100px;">Nume:</td><td style="padding: 8px 12px;">${payload.student_name}</td></tr>
    <tr><td style="padding: 8px 12px; font-weight: bold;">Email:</td><td style="padding: 8px 12px;"><a href="mailto:${payload.student_email}">${payload.student_email}</a></td></tr>
    <tr><td style="padding: 8px 12px; font-weight: bold;">Materie:</td><td style="padding: 8px 12px;">${payload.subject_name}</td></tr>
  </table>

  <h2 style="color: #087e74; margin-top: 24px;">Mesajul elevului</h2>
  <div style="background: #f9fafb; border-radius: 12px; padding: 16px; border: 1px solid #e5e7eb;">
    <p style="font-size: 14px; line-height: 1.6; margin: 0;">${payload.message}</p>
  </div>

  <div style="margin-top: 32px; text-align: center;">
    <a href="${requestsUrl}" style="display: inline-block; padding: 14px 32px; background-color: #0f524d; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
      Vezi cererile mele
    </a>
  </div>

  <p style="margin-top: 16px; font-size: 13px; color: #9ca3af; text-align: center;">
    Deblocheaza cererea folosind credite pentru a vedea toate detaliile si a incepe o conversatie.
  </p>

  <hr style="margin-top: 32px; border: none; border-top: 1px solid #e5e7eb;">
  <p style="font-size: 12px; color: #9ca3af; margin-top: 12px;">
    Acest email a fost trimis automat de MeditatiiPro.
  </p>
</body>
</html>`.trim();

    const textBody = `
Cerere noua de intalnire
========================

Buna ${tutorProfile.name},

Un elev doreste sa se intalneasca cu tine pentru ${payload.subject_name}.

INFORMATII ELEV
---------------
Nume: ${payload.student_name}
Email: ${payload.student_email}
Materie: ${payload.subject_name}

MESAJUL ELEVULUI
----------------
${payload.message}

Vezi cererile tale: ${requestsUrl}

Deblocheaza cererea folosind credite pentru a vedea toate detaliile si a incepe o conversatie.
`.trim();

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({
          success: true,
          method: "logged",
          message: "Request notification received (email not configured)",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "MeditatiiPro <noreply@meditatiipro.ro>",
        to: [tutorProfile.email],
        subject: `Cerere noua: ${payload.student_name} - ${payload.subject_name}`,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      return new Response(
        JSON.stringify({ success: false, error: errorText }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, method: "email" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
