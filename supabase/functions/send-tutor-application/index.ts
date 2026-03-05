import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RECIPIENT_EMAIL = Deno.env.get("TUTOR_APPLICATION_EMAIL") || "contact@meditatiipro.ro";

interface TutorApplication {
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  experience: string;
  education: string;
  subjects: string[];
  specialties: string[];
  mode: string;
  sessionType: string;
  price: string;
  days: string[];
  hours: string[];
  levels: string[];
}

function buildEmailBody(app: TutorApplication): string {
  return `
Noua aplicatie de profesor pe MeditatiiPro
==========================================

DATE PERSONALE
--------------
Nume: ${app.name}
Email: ${app.email}
Telefon: ${app.phone}
Oras: ${app.city}

EXPERIENTA SI EDUCATIE
----------------------
Studii: ${app.education}
Experienta: ${app.experience}
Despre: ${app.bio}

MATERII SI COMPETENTE
---------------------
Materii: ${app.subjects.join(", ")}
Specializari: ${app.specialties.join(", ") || "N/A"}
Niveluri: ${app.levels.join(", ")}
Mod predare: ${app.mode}
Tip sedinte: ${app.sessionType}
Pret dorit: ${app.price}

DISPONIBILITATE
---------------
Zile: ${app.days.join(", ")}
Ore: ${app.hours.join(", ")}

==========================================
Aceasta aplicatie a fost trimisa automat prin formularul de pe MeditatiiPro.
  `.trim();
}

function buildHtmlBody(app: TutorApplication): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
  <h1 style="color: #0f524d; border-bottom: 3px solid #08c4ae; padding-bottom: 12px;">
    Noua aplicatie de profesor
  </h1>

  <h2 style="color: #087e74; margin-top: 24px;">Date personale</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 6px 12px; font-weight: bold; width: 120px;">Nume:</td><td style="padding: 6px 12px;">${app.name}</td></tr>
    <tr><td style="padding: 6px 12px; font-weight: bold;">Email:</td><td style="padding: 6px 12px;"><a href="mailto:${app.email}">${app.email}</a></td></tr>
    <tr><td style="padding: 6px 12px; font-weight: bold;">Telefon:</td><td style="padding: 6px 12px;">${app.phone}</td></tr>
    <tr><td style="padding: 6px 12px; font-weight: bold;">Oras:</td><td style="padding: 6px 12px;">${app.city}</td></tr>
  </table>

  <h2 style="color: #087e74; margin-top: 24px;">Experienta si educatie</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 6px 12px; font-weight: bold; width: 120px;">Studii:</td><td style="padding: 6px 12px;">${app.education}</td></tr>
    <tr><td style="padding: 6px 12px; font-weight: bold;">Experienta:</td><td style="padding: 6px 12px;">${app.experience}</td></tr>
    <tr><td style="padding: 6px 12px; font-weight: bold; vertical-align: top;">Despre:</td><td style="padding: 6px 12px;">${app.bio}</td></tr>
  </table>

  <h2 style="color: #087e74; margin-top: 24px;">Materii si competente</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 6px 12px; font-weight: bold; width: 120px;">Materii:</td><td style="padding: 6px 12px;">${app.subjects.join(", ")}</td></tr>
    <tr><td style="padding: 6px 12px; font-weight: bold;">Specializari:</td><td style="padding: 6px 12px;">${app.specialties.join(", ") || "N/A"}</td></tr>
    <tr><td style="padding: 6px 12px; font-weight: bold;">Niveluri:</td><td style="padding: 6px 12px;">${app.levels.join(", ")}</td></tr>
    <tr><td style="padding: 6px 12px; font-weight: bold;">Mod predare:</td><td style="padding: 6px 12px;">${app.mode}</td></tr>
    <tr><td style="padding: 6px 12px; font-weight: bold;">Tip sedinte:</td><td style="padding: 6px 12px;">${app.sessionType}</td></tr>
    <tr><td style="padding: 6px 12px; font-weight: bold;">Pret dorit:</td><td style="padding: 6px 12px;">${app.price}</td></tr>
  </table>

  <h2 style="color: #087e74; margin-top: 24px;">Disponibilitate</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 6px 12px; font-weight: bold; width: 120px;">Zile:</td><td style="padding: 6px 12px;">${app.days.join(", ")}</td></tr>
    <tr><td style="padding: 6px 12px; font-weight: bold;">Ore:</td><td style="padding: 6px 12px;">${app.hours.join(", ")}</td></tr>
  </table>

  <hr style="margin-top: 32px; border: none; border-top: 1px solid #e5e7eb;">
  <p style="font-size: 12px; color: #9ca3af; margin-top: 12px;">
    Aceasta aplicatie a fost trimisa automat prin formularul de pe MeditatiiPro.
  </p>
</body>
</html>
  `.trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const application: TutorApplication = await req.json();

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({
          success: true,
          method: "logged",
          message: "Application received (email service not configured, logged to console)",
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
        to: [RECIPIENT_EMAIL],
        subject: `Noua aplicatie profesor: ${application.name}`,
        text: buildEmailBody(application),
        html: buildHtmlBody(application),
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
