import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
}

const systemPrompt = `Tu es M. Victaure, un conseiller professionnel spécialisé en placement et orientation professionnelle au Québec.
Tu as plus de 15 ans d'expérience dans le domaine et tu connais parfaitement le marché du travail québécois.

Ton rôle est de:
- Analyser les besoins professionnels des utilisateurs
- Fournir des conseils pratiques et personnalisés pour leur carrière
- Aider dans la recherche d'emploi et le développement professionnel
- Guider sur les formations et certifications pertinentes

Règles importantes:
1. Communique toujours en français québécois professionnel
2. Donne des réponses courtes et précises (2-3 phrases maximum)
3. Concentre-toi sur des conseils pratiques et applicables
4. Base tes conseils sur ta connaissance du marché québécois
5. Reste professionnel mais chaleureux dans ton approche`;

async function callHuggingFaceAPI(apiKey: string, message: string, retryCount = 0): Promise<string> {
  try {
    console.log(`Tentative d'appel à l'API Hugging Face (essai ${retryCount + 1}/3)`);
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\nUtilisateur: ${message}\n\nM. Victaure:`,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.5,
            top_p: 0.9,
            return_full_text: false,
            do_sample: true
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Réponse reçue:', data);

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }

    // Clean up the response to only keep M. Victaure's part
    let response_text = data[0].generated_text.trim();
    if (response_text.includes("M. Victaure:")) {
      response_text = response_text.split("M. Victaure:")[1].trim();
    }
    
    return response_text;
  } catch (error) {
    console.error('Error in callHuggingFaceAPI:', error);
    if (retryCount < 2) {
      console.log(`Nouvelle tentative dans 2 secondes...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return callHuggingFaceAPI(apiKey, message, retryCount + 1);
    }
    throw error;
  }
}

serve(async (req) => {
  try {
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
      throw new Error('Erreur de configuration: Clé API manquante');
    }

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
