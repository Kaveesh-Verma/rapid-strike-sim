import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InsightRequest {
  mode: 'hint' | 'guided' | 'validation';
  scenario: {
    type: string;
    difficulty: string;
    content: Record<string, unknown>;
    correctAnswer: string;
    redFlags?: string[];
    trustIndicators?: string[];
  };
  userAction?: string;
  isCorrect?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode, scenario, userAction, isCorrect }: InsightRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (mode) {
      case 'hint':
        systemPrompt = `You are a cybersecurity training assistant. Provide subtle hints about potential security concerns WITHOUT revealing whether something is phishing or legitimate. Focus on teaching users what to look for.`;
        userPrompt = `The user is viewing a ${scenario.type} scenario (${scenario.difficulty} difficulty). 
        
Provide 2-3 subtle hints about what security aspects they should consider, such as:
- Domain/sender verification techniques
- Common manipulation tactics to watch for
- Signs of urgency or pressure tactics

DO NOT reveal if this is phishing or legitimate. Just guide their thinking.

Scenario content: ${JSON.stringify(scenario.content)}`;
        break;

      case 'guided':
        systemPrompt = `You are a cybersecurity instructor using the Socratic method. Guide users through security analysis step-by-step without giving away the answer.`;
        userPrompt = `Guide the user through analyzing this ${scenario.type} scenario:

${JSON.stringify(scenario.content)}

Provide a step-by-step framework they can use:
1. What should they check first?
2. What patterns might indicate deception?
3. What verification steps could they take?

Do NOT reveal the answer. Help them think critically.`;
        break;

      case 'validation':
        systemPrompt = `You are a cybersecurity training evaluator. Provide detailed post-action feedback on what the user did right or wrong, and what they missed.`;
        userPrompt = `Evaluate the user's response to this ${scenario.type} scenario:

Scenario: ${JSON.stringify(scenario.content)}
User action: ${userAction}
Was correct: ${isCorrect}
Correct answer was: ${scenario.correctAnswer}
Red flags present: ${scenario.redFlags?.join(', ') || 'None listed'}
Trust indicators: ${scenario.trustIndicators?.join(', ') || 'None listed'}

Provide:
1. What they did right (if anything)
2. What they missed (red flags or trust indicators)
3. How this attack/legitimate message pattern works in the real world
4. One actionable tip for next time`;
        break;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ insight: content, mode }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI Insight Agent error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error",
        insight: "Unable to generate insight at this time. Trust your instincts and look for common red flags like urgency, suspicious domains, and requests for sensitive information."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
