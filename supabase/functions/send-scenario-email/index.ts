import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendScenarioRequest {
  email: string;
  scenarioData: any;
  userId?: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, scenarioData, userId }: SendScenarioRequest = await req.json();

    // Validate input
    if (!email || !validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!scenarioData || !scenarioData.id) {
      return new Response(
        JSON.stringify({ error: "Invalid scenario data" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Extract details
    const subject = scenarioData.content?.subject || scenarioData.title || "Security Training Scenario";
    const token = crypto.randomUUID();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const appUrl = Deno.env.get("APP_URL") || "https://rapid-strike-sim.vercel.app";
    const fromEmail = Deno.env.get("FROM_EMAIL") || "noreply@rapidcapture.net";

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const scenarioLink = `${appUrl}/scenario/${token}`;

    // Send email via Resend
    const emailPayload = {
      from: `Rapid Strike Simulator <${fromEmail}>`,
      to: email,
      subject: `[SIMULATION] ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .container { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .banner { background: #1a1a2e; color: #00ff88; padding: 20px; text-align: center; font-weight: bold; }
            .content { padding: 20px; }
            .cta { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="banner">🛡️ RAPID STRIKE SECURITY SIMULATION</div>
            <div class="content">
              <h2>Security Training Scenario</h2>
              <p>You have received a new security training scenario.</p>
              <p><strong>Type:</strong> ${scenarioData.type || 'Email'}</p>
              <p><strong>Difficulty:</strong> ${scenarioData.difficulty || 'Medium'}</p>
              <p><strong>Title:</strong> ${subject}</p>
              <br>
              <a href="${scenarioLink}" class="cta">Open Simulation →</a>
              <br><br>
              <p style="color: #666; font-size: 12px;">This is a training simulation from Rapid Strike Simulator.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    console.log("Sending email to:", email);
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Email service error: ${response.statusText}` }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const result = await response.json();
    console.log("Email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, token, message: "Scenario sent to your email" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Function error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
