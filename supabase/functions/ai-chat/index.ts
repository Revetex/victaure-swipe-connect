import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log('Message reçu:', message);

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('Clé API manquante');
    }

    const systemPrompt = `Tu es M. Victaure, conseiller en orientation professionnelle au Québec.
- Réponds en UNE phrase simple et claire
- Pose UNE question pour mieux comprendre
- Utilise un français québécois simple et amical

Question: ${message}`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: systemPrompt,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data[0]?.generated_text
      ?.split('Assistant:').pop()
      ?.split('Human:')[0]
      ?.trim();

    if (!aiResponse) {
      aiResponse = "Comment puis-je vous aider dans votre développement professionnel?";
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ 
        response: "Quel domaine professionnel vous intéresse?",
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});