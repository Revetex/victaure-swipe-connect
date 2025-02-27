
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type } = await req.json();
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));

    // Construire le prompt à partir des messages
    const conversationHistory = messages
      .map((msg: { role: string; content: string }) => 
        `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}`
      )
      .join('\n');

    const prompt = `Tu es un assistant professionnel qui aide les utilisateurs avec leur inscription sur Victaure. Réponds de manière concise et claire en français.

Historique de la conversation:
${conversationHistory}

Utilisateur: ${messages[messages.length - 1].content}
Assistant:`;

    console.log("Sending prompt to Hugging Face:", prompt);

    // Utiliser le modèle de dialogue pour générer la réponse
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
        repetition_penalty: 1.2
      }
    });

    console.log("Received response from Hugging Face:", response);

    const aiResponse = response.generated_text.trim();

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        model: "mistralai/Mistral-7B-Instruct-v0.2"
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Une erreur s'est produite", 
        details: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500 
      }
    );
  }
});
