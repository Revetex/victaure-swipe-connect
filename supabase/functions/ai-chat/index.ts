import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const systemPrompt = `T'es M. Victaure, un gars de chantier québécois qui s'y connaît en construction.

Règles:
- Parle comme un vrai québécois, utilise le slang naturellement
- Réponds direct, sans bullshit
- Donne des vrais conseils basés sur ton expérience
- Adapte-toi au gars qui te parle
- Garde une suite logique dans conversation
- Pas de politesse excessive, parle naturel`

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const MODEL_LOADING_STATUS = 503;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callHuggingFaceAPI(apiKey: string, message: string, context: any = {}, retryCount = 0): Promise<string> {
  try {
    console.log(`Tentative d'appel à l'API Hugging Face (essai ${retryCount + 1}/${MAX_RETRIES})`);
    
    const previousMessages = context?.previousMessages || [];
    const conversationContext = previousMessages.length > 0 
      ? previousMessages
          .map((msg: any) => `${msg.sender === 'user' ? 'Gars' : 'Moi'}: ${msg.content}`)
          .join('\n')
      : '';

    const userProfile = context?.userProfile ? `
Info sur le gars:
${context.userProfile.full_name ? '- Nom: ' + context.userProfile.full_name : ''}
${context.userProfile.role ? '- Job: ' + context.userProfile.role : ''}
${context.userProfile.skills?.length ? '- Skills: ' + context.userProfile.skills.join(', ') : ''}
${context.userProfile.city ? '- Ville: ' + context.userProfile.city : ''}
${context.userProfile.bio ? '- Bio: ' + context.userProfile.bio : ''}` : '';

    const fullPrompt = `${systemPrompt}\n\n${userProfile}\n\n${conversationContext}\n\nGars: ${message}\n\nMoi:`;
    
    console.log('Envoi du prompt à Hugging Face:', fullPrompt);
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 1.2,
            top_p: 0.95,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur de l\'API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });

      if (response.status === MODEL_LOADING_STATUS && retryCount < MAX_RETRIES) {
        console.log(`Modèle en cours de chargement, nouvelle tentative dans ${RETRY_DELAY/1000} secondes...`);
        await sleep(RETRY_DELAY);
        return callHuggingFaceAPI(apiKey, message, context, retryCount + 1);
      }

      throw new Error(`Erreur API: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    console.log('Réponse reçue:', data);

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }

    let assistantResponse = data[0].generated_text.trim();
    if (assistantResponse.startsWith('Moi:')) {
      assistantResponse = assistantResponse.substring('Moi:'.length).trim();
    }

    return assistantResponse;
  } catch (error) {
    console.error('Error in callHuggingFaceAPI:', error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Erreur lors de l'appel API, nouvelle tentative dans ${RETRY_DELAY/1000} secondes... (${error.message})`);
      await sleep(RETRY_DELAY);
      return callHuggingFaceAPI(apiKey, message, context, retryCount + 1);
    }
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();
    console.log('Message reçu:', message);
    console.log('ID utilisateur:', userId);
    console.log('Contexte:', context);

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      console.error('Clé API Hugging Face manquante');
      throw new Error('Erreur de configuration: Clé API manquante');
    }

    console.log('Appel de l\'API Hugging Face');
    const assistantResponse = await callHuggingFaceAPI(apiKey, message, context);

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });

    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la communication avec l\'assistant',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
})