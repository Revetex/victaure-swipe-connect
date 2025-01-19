import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log('Question reçue:', message);

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('Configuration API incorrecte');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const prompt = `Tu es M. Victaure, un conseiller en orientation professionnel québécois sympathique.
    
Question: ${message}

Réponse:`;

    console.log('Envoi de la requête...');

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.8,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Erreur API Hugging Face');
    }

    const data = await response.json();
    let aiResponse = data[0]?.generated_text?.trim() || "Je m'excuse, pouvez-vous reformuler votre question?";

    // Nettoyer la réponse
    aiResponse = aiResponse
      .replace(/^Réponse:\s*/i, '')
      .replace(/^M\. Victaure:\s*/i, '')
      .trim();

    console.log('Réponse générée:', aiResponse);

    // Sauvegarder l'interaction
    await supabase
      .from('ai_learning_data')
      .insert({
        user_id: userId,
        question: message,
        response: aiResponse
      });

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    return new Response(
      JSON.stringify({ 
        response: "Désolé, je suis un peu surchargé en ce moment. On se reparle dans quelques instants?"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});