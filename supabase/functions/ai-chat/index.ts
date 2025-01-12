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
    - Tu DOIS TOUJOURS répondre avec des phrases complètes en français
    - Tu ne dois JAMAIS répondre avec des chiffres seuls
    - Tu ne dois JAMAIS répondre avec des caractères spéciaux seuls
    - Chaque réponse doit contenir au minimum une phrase complète
    - Commence toujours ta réponse par une phrase d'introduction
    - Termine toujours ta réponse par une conclusion
    - Donne des conseils pratiques et concrets
    - Adapte tes réponses au contexte québécois
    - Utilise un français correct et professionnel
    - Évite le jargon technique sauf si nécessaire
    - Limite tes réponses à 2-3 paragraphes maximum
    
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

    // Strict validation to ensure proper response format
    const validationChecks = [
      {
        condition: !aiResponse || aiResponse.length < 20,
        error: 'Réponse trop courte'
      },
      {
        condition: /^\d+$/.test(aiResponse),
        error: 'Réponse contient uniquement des chiffres'
      },
      {
        condition: !/[a-zA-Z]/.test(aiResponse),
        error: 'Réponse ne contient pas de lettres'
      },
      {
        condition: !/[.!?]/.test(aiResponse),
        error: 'Réponse sans ponctuation'
      },
      {
        condition: aiResponse.split(' ').length < 5,
        error: 'Réponse trop courte (mots)'
      },
      {
        condition: aiResponse.includes("undefined") || aiResponse.includes("[object Object]"),
        error: 'Réponse contient des erreurs techniques'
      }
    ];

    for (const check of validationChecks) {
      if (check.condition) {
        console.error('Validation échouée:', check.error);
        console.error('Réponse invalide:', aiResponse);
        throw new Error(`Réponse invalide: ${check.error}`);
      }
    }

    // Format the response
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
    
    const errorMessage = "Je m'excuse, mais je ne peux pas générer une réponse appropriée pour le moment. Pourriez-vous reformuler votre question de manière plus détaillée ?";
    
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