import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const MODEL_LOADING_STATUS = 503;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callHuggingFaceAPI(apiKey: string, message: string, retryCount = 0): Promise<string> {
  try {
    console.log(`Tentative d'appel à l'API Hugging Face (essai ${retryCount + 1}/${MAX_RETRIES})`);
    console.log('Message:', message);
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            top_p: 0.9,
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
        return callHuggingFaceAPI(apiKey, message, retryCount + 1);
      }

      throw new Error(`Erreur API: ${response.status} ${response.statusText}\n${errorText}`);
    }

    const data = await response.json();
    console.log('Réponse reçue:', data);

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Format de réponse invalide:', data);
      throw new Error('Format de réponse invalide');
    }

    return data[0].generated_text.trim();
  } catch (error) {
    console.error('Error in callHuggingFaceAPI:', error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Erreur lors de l'appel API, nouvelle tentative dans ${RETRY_DELAY/1000} secondes... (${error.message})`);
      await sleep(RETRY_DELAY);
      return callHuggingFaceAPI(apiKey, message, retryCount + 1);
    }
    throw error;
  }
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        status: 204, 
        headers: corsHeaders 
      });
    }

    if (req.method !== 'POST') {
      throw new Error(`Method ${req.method} not allowed`);
    }

    const { message } = await req.json();
    console.log('Message reçu:', message);

    if (!message || typeof message !== 'string') {
      throw new Error('Message invalide ou manquant');
    }

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      console.error('Clé API Hugging Face manquante');
      throw new Error('Erreur de configuration: Clé API manquante');
    }

    console.log('Appel de l\'API Hugging Face');
    const assistantResponse = await callHuggingFaceAPI(apiKey, message);

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: corsHeaders }
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
        headers: corsHeaders,
        status: 500 
      }
    );
  }
})