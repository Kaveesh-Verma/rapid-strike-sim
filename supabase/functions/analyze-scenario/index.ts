import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Authenticated user:', user.id);

    const { scenario, userAction, correctAction, isCorrect, timeTaken } = await req.json();

    const prompt = `You are a cybersecurity training AI assistant. A user just completed an attack simulation scenario.

SCENARIO DETAILS:
- Title: ${scenario.title}
- Type: ${scenario.type}
- Difficulty: ${scenario.difficulty}

USER'S RESPONSE:
- Action taken: ${userAction}
- Correct action was: ${correctAction}
- Result: ${isCorrect ? 'CORRECT' : 'INCORRECT'}
- Time taken: ${timeTaken} seconds

Provide a brief, helpful analysis in JSON format with these exact fields:
{
  "feedback": "2-3 sentences explaining why their choice was ${isCorrect ? 'correct' : 'incorrect'} and what to learn from this",
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "threat_level": "low|medium|high|critical",
  "real_world_impact": "Brief description of what could happen in a real attack"
}

Be encouraging but educational. Keep it concise.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Rapid Capture Security Trainer',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a cybersecurity expert providing training feedback. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter error:', error);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    let analysis;
    
    try {
      const content = data.choices[0].message.content;
      analysis = typeof content === 'string' ? JSON.parse(content) : content;
    } catch (parseError) {
      console.error('Parse error:', parseError);
      // Fallback response
      analysis = {
        feedback: isCorrect 
          ? "Excellent work! You correctly identified the threat and took appropriate action."
          : "This was a learning opportunity. Always verify suspicious communications through official channels.",
        tips: [
          "Check sender email addresses carefully",
          "Never click links in urgent emails",
          "Report suspicious emails to IT"
        ],
        threat_level: scenario.difficulty === 'hard' ? 'critical' : scenario.difficulty === 'medium' ? 'high' : 'medium',
        real_world_impact: "Falling for this type of attack could lead to credential theft, data breaches, or financial loss."
      };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in analyze-scenario function:', errorMessage);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      feedback: "Analysis unavailable. Keep learning and stay vigilant!",
      tips: ["Always verify suspicious communications", "Report potential threats to IT"],
      threat_level: "medium",
      real_world_impact: "Stay aware of cyber threats to protect yourself and your organization."
    }), {
      status: 200, // Return 200 with fallback to not break UI
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
