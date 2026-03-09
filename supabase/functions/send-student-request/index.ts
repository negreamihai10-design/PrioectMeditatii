import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const body = await req.json();

    let requestId: string | undefined;
    let legacyPayload: {
      tutor_id: string;
      student_name: string;
      student_email: string;
      subject_name: string;
      message: string;
    } | undefined;

    if (body.type === "INSERT" && body.record?.id) {
      requestId = body.record.id;
    } else if (body.request_id) {
      requestId = body.request_id;
    } else if (body.tutor_id) {
      legacyPayload = body;
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let tutorId: string;
    let studentName: string;
    let studentEmail: string;
    let subjectName: string;
    let message: string;

    if (requestId) {
      const { data: request } = await supabase
        .from("tutor_requests")
        .select("*, subjects(name)")
        .eq("id", requestId)
        .maybeSingle();

      if (!request) {
        return new Response(
          JSON.stringify({ success: false, error: "Request not found" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      tutorId = request.tutor_id;
      studentName = request.student_name;
      studentEmail = request.student_email;
      subjectName = request.subjects?.name ?? "Necunoscut";
      message = request.message;
    } else if (legacyPayload) {
      tutorId = legacyPayload.tutor_id;
      studentName = legacyPayload.student_name;
      studentEmail = legacyPayload.student_email;
      subjectName = legacyPayload.subject_name;
      message = legacyPayload.message;
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: tutorProfile } = await supabase
      .from("tutor_profiles")
      .select("email, name")
      .eq("id", tutorId)
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
  <div style="background: linear-gradient(135deg, #0f524d 0%, #087e74 100%); border-radius: 16px; padding: 32px; margin-bottom: 24px;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
      Cerere noua de intalnire
    </h1>
    <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px;">
      Un elev doreste sa lucreze cu tine
    </p>
  </div>

  <p style="font-size: 16px; line-height: 1.6;">
    Buna ${tutorProfile.name},
  </p>

  <p style="font-size: 16px; line-height: 1.6;">
    Un elev doreste sa se intalneasca cu tine pentru <strong>${subjectName}</strong>. Mai jos gasesti detaliile cererii.
  </p>

  <div style="background: #f9fafb; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb; margin: 24px 0;">
    <h2 style="color: #087e74; margin: 0 0 16px 0; font-size: 18px;">Informatii elev</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; width: 100px; color: #6b7280;">Nume:</td>
        <td style="padding: 8px 12px; color: #111827;">${studentName}</td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; color: #6b7280;">Email:</td>
        <td style="padding: 8px 12px;"><a href="mailto:${studentEmail}" style="color: #087e74;">${studentEmail}</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: bold; color: #6b7280;">Materie:</td>
        <td style="padding: 8px 12px; color: #111827;">${subjectName}</td>
      </tr>
    </table>
  </div>

  <div style="background: #f9fafb; border-radius: 12px; padding: 20px; border: 1px solid #e5e7eb; margin: 24px 0;">
    <h2 style="color: #087e74; margin: 0 0 12px 0; font-size: 18px;">Mesajul elevului</h2>
    <p style="font-size: 14px; line-height: 1.6; margin: 0; color: #374151;">${message}</p>
  </div>

  <div style="margin-top: 32px; text-align: center;">
    <a href="${requestsUrl}" style="display: inline-block; padding: 16px 40px; background-color: #0f524d; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
      Vezi cererea in contul meu
    </a>
  </div>

  <p style="margin-top: 16px; font-size: 13px; color: #9ca3af; text-align: center;">
    Deblocheaza cererea folosind credite pentru a vedea toate detaliile si a incepe o conversatie.
  </p>

  <hr style="margin-top: 32px; border: none; border-top: 1px solid #e5e7eb;">
  <p style="font-size: 12px; color: #9ca3af; margin-top: 12px; text-align: center;">
    Acest email a fost trimis automat de MeditatiiPro.
  </p>
</body>
</html>`.trim();

    const textBody = `
Cerere noua de intalnire
========================

Buna ${tutorProfile.name},

Un elev doreste sa se intalneasca cu tine pentru ${subjectName}.

INFORMATII ELEV
---------------
Nume: ${studentName}
Email: ${studentEmail}
Materie: ${subjectName}

MESAJUL ELEVULUI
----------------
${message}

Vezi cererea: ${requestsUrl}

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
        subject: `Cerere noua: ${studentName} - ${subjectName}`,
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
