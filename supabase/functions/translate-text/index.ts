
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function translateWithRetry(
  text: string,
  sourceLang: string,
  targetLang: string,
  huggingFaceApiKey: string,
  retryCount = 0
): Promise<any> {
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/Helsinki-NLP/opus-mt-${sourceLang}-${targetLang}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
        }),
      }
    );

    const data = await response.json();

    // Check if model is loading
    if (!response.ok && data.error?.includes('is currently loading')) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Model loading, attempt ${retryCount + 1} of ${MAX_RETRIES}. Retrying in ${RETRY_DELAY}ms...`);
        await sleep(RETRY_DELAY);
        return translateWithRetry(text, sourceLang, targetLang, huggingFaceApiKey, retryCount + 1);
      }
      throw new Error('Model failed to load after maximum retries');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Translation failed');
    }

    return data;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Request failed, attempt ${retryCount + 1} of ${MAX_RETRIES}. Retrying in ${RETRY_DELAY}ms...`);
      await sleep(RETRY_DELAY);
      return translateWithRetry(text, sourceLang, targetLang, huggingFaceApiKey, retryCount + 1);
    }
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, sourceLang, targetLang } = await req.json();

    // Make sure we have the required Hugging Face API key
    const huggingFaceApiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!huggingFaceApiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    // Call Hugging Face API for translation with retry mechanism
    const data = await translateWithRetry(text, sourceLang, targetLang, huggingFaceApiKey);
    
    const translatedText = Array.isArray(data) ? data[0].translation_text : data.translation_text;
    const detectedLanguage = sourceLang; // For now, we trust the source language

    // Return the translation
    return new Response(
      JSON.stringify({ 
        translatedText,
        detectedLanguage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in translate-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
