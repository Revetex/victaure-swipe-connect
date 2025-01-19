import "https://deno.land/x/xhr@0.1.0/mod.ts";
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

    const prompt = `Tu es M. Victaure, un conseiller en orientation professionnel québécois sympathique et empathique.

Ton style:
- Utilise un français québécois naturel et décontracté
- Sois empathique et à l'écoute
- Pose des questions pertinentes pour mieux comprendre
- Adapte ton langage au contexte de la personne
- Partage ton expertise du marché québécois

Contexte de l'utilisateur:
${profile ? `
- Nom: ${profile.full_name}
- Ville: ${profile.city || 'Non spécifiée'}
- Compétences: ${profile.skills?.join(', ') || 'Non spécifiées'}
` : ''}

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
            max_new_tokens: 150,
            temperature: 0.7,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Erreur API Hugging Face');
    }

    const data = await response.json();
    let aiResponse = data[0]?.generated_text?.trim() || "Je m'excuse, je n'ai pas bien compris. Pouvez-vous reformuler?";

    // Nettoyer la réponse
    aiResponse = aiResponse
      .replace(/^Réponse:\s*/i, '')
      .replace(/^M\. Victaure:\s*/i, '')
      .trim();

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
        response: "Je m'excuse, je ne suis pas disponible pour le moment. Pouvez-vous réessayer dans quelques instants?"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});