import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log('Message reçu:', message);

    if (!message || typeof message !== 'string') {
      throw new Error('Message invalide ou manquant');
    }

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('Erreur de configuration: Clé API manquante');
    }

    const systemPrompt = `Tu es M. Victaure, un conseiller en orientation professionnelle expérimenté au Québec. 
    Tu dois répondre en français de manière professionnelle et bienveillante.
    
    Directives importantes:
    - Réponds TOUJOURS en français avec des phrases complètes
    - Ne réponds JAMAIS avec uniquement des chiffres ou des caractères spéciaux
    - Donne des conseils pratiques et concrets
    - Adapte tes réponses au contexte québécois
    - Utilise un français correct et professionnel
    - Évite le jargon technique sauf si nécessaire
    - Limite tes réponses à 2-3 paragraphes maximum
    - Assure-toi que ta réponse soit toujours cohérente et complète
    
    Question de l'utilisateur: ${message}
    
    Ta réponse doit être claire, concise et utile.`;

    console.log('Envoi de la requête à Hugging Face...');

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
            max_new_tokens: 1000,
            temperature: 0.7,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      console.error('Erreur API Hugging Face:', response.status, response.statusText);
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Réponse brute:', data);

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }

    // Clean up the response
    let aiResponse = data[0].generated_text
      .replace(/^[^:]*:/, '') // Remove any prefix before first colon
      .replace(/Assistant:/gi, '') // Remove "Assistant:" prefix
      .replace(/^\s*$[\n\r]{1,}/gm, '') // Remove empty lines
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .trim();

    // Additional validation to ensure we have a proper response
    if (!aiResponse || 
        aiResponse.length < 10 || 
        /^\d+$/.test(aiResponse) || // Check if response is only numbers
        !/[a-zA-Z]/.test(aiResponse) || // Ensure response contains letters
        aiResponse.includes("undefined") ||
        aiResponse.includes("[object Object]")) {
      console.error('Réponse invalide générée:', aiResponse);
      throw new Error('Réponse invalide générée');
    }

    // Ensure the response starts with a capital letter and ends with punctuation
    aiResponse = aiResponse.charAt(0).toUpperCase() + aiResponse.slice(1);
    if (!aiResponse.match(/[.!?]$/)) {
      aiResponse += '.';
    }

    console.log('Réponse nettoyée:', aiResponse);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    
    // Send a user-friendly error message
    const errorMessage = "Je suis désolé, j'ai du mal à comprendre votre demande pour le moment. Pourriez-vous reformuler votre question différemment ?";
    
    return new Response(
      JSON.stringify({ 
        response: errorMessage,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});