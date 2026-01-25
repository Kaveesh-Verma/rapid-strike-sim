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

// Validate email format
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Retry logic for API calls
const retryFetch = async (url: string, options: RequestInit, maxRetries: number = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status !== 429) return response;
      
      // Wait before retrying (exponential backoff)
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error("Max retries exceeded");
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, scenarioData, userId }: SendScenarioRequest = await req.json();

    // Validate email
    if (!email || !validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address provided" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate scenario data
    if (!scenarioData || !scenarioData.id) {
      return new Response(
        JSON.stringify({ error: "Invalid scenario data" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Extract subject from scenario data
    const subject = scenarioData.content?.subject || scenarioData.title || "Security Training Scenario";

    // Generate unique token
    const token = crypto.randomUUID();
    
    // Get Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration missing");
    }
    
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
      throw new Error(`Failed to store scenario token: ${dbError.message}`);
    }

    // Build scenario link
    const appUrl = Deno.env.get("APP_URL") || "https://rapid-strike-sim.vercel.app";
    const scenarioLink = `${appUrl}/scenario/${token}`;

    // Send email using Resend API
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const emailResponse = await retryFetch("https://api.resend.com/emails", {
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
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
              .container { background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
              .banner { background: #1a1a2e; color: #00ff88; padding: 20px; text-align: center; font-weight: bold; }
              .content { padding: 20px; }
              .info { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 12px; margin: 15px 0; border-radius: 4px; font-size: 14px; }
              .cta { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
              .cta:hover { background: #2563eb; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
              .message-preview { background: #f9fafb; border: 1px solid #e5e7eb; padding: 12px; border-radius: 4px; margin: 15px 0; font-family: monospace; font-size: 13px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="banner">🛡️ RAPID STRIKE SECURITY SIMULATION</div>
              <div class="content">
                <h2 style="margin: 0 0 15px 0; color: #1f2937;">Security Training Scenario</h2>
                <p style="color: #6b7280; margin: 0 0 15px 0;">You have received a new security training scenario. This is a simulated attack for educational purposes.</p>
                
                <div class="info">
                  <strong>Scenario Type:</strong> ${scenarioData.type || 'Email'}<br>
                  <strong>Difficulty:</strong> ${scenarioData.difficulty || 'Medium'}<br>
                  <strong>Title:</strong> ${subject}
                </div>

                <div class="message-preview">
                  <strong>From:</strong> ${scenarioData.content?.from || 'Unknown Sender'}<br>
                  <strong>Subject:</strong> ${subject}
                  <hr style="margin: 10px 0;">
                  <div style="white-space: pre-wrap; max-height: 200px; overflow-y: auto;">${(scenarioData.content?.body || 'No content').substring(0, 500)}...</div>
                </div>

                <center>
                  <a href="${scenarioLink}" class="cta">Open Simulation →</a>
                </center>

                <div class="footer">
                  <p><strong>📱 Mobile Practice:</strong> You can access this scenario on your phone too!</p>
                  <p>This is a training simulation from Rapid Strike Simulator. Click the button above to begin the exercise.</p>
                  <p style="margin-top: 15px; color: #9ca3af; font-size: 11px;">Token: ${token}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    // Check email response
    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Email API error:", emailResponse.status, errorData);
      throw new Error(`Email service error: ${emailResponse.statusText}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

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
