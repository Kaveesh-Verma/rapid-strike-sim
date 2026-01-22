import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendScenarioRequest {
  email: string;
  scenarioData: any;
  userId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, scenarioData, userId }: SendScenarioRequest = await req.json();

    // Generate unique token
    const token = crypto.randomUUID();
    
    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store token in database
    const { error: dbError } = await supabase.from("scenario_tokens").insert({
      token,
      user_id: userId || null,
      scenario_data: scenarioData,
      email_sent_to: email,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store scenario token");
    }

    // Build scenario link
    const appUrl = Deno.env.get("APP_URL") || "https://rapid-strike-sim.lovable.app";
    const scenarioLink = `${appUrl}/scenario/${token}`;

    // Send email using Resend API directly
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Rapid Strike Simulator <onboarding@resend.dev>",
        to: [email],
        subject: `[SIMULATION] ${subject}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
              .banner { background: #1a1a2e; color: #00ff88; padding: 10px; text-align: center; margin-bottom: 20px; }
              .content { background: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; }
              .cta { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="banner">🛡️ RAPID STRIKE SECURITY SIMULATION</div>
            <div class="content">
              <p><strong>From:</strong> ${scenarioData.content?.from || 'Unknown Sender'}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr>
              <div style="white-space: pre-wrap;">${scenarioData.content?.body || 'No content'}</div>
              <br>
              <a href="${scenarioLink}" class="cta">Open Simulation →</a>
            </div>
            <div class="footer">
              <p>This is a training simulation from Rapid Strike Simulator.</p>
              <p>Click the button to interact with the simulation.</p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Email sent:", emailResult);

    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-scenario-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
