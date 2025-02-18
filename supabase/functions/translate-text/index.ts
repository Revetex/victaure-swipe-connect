
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function translateWithElevenLabs(
  text: string,
  sourceLang: string,
  targetLang: string,
  apiKey: string
): Promise<any> {
  try {
    const response = await fetch(
      'https://api.elevenlabs.io/v1/translation',
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          source_lang: sourceLang,
          target_lang: targetLang
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      translatedText: data.translation,
      detectedLanguage: sourceLang
    };
  } catch (error) {
    console.error('ElevenLabs translation error:', error);
    throw error;
  }
}

async function textToSpeech(text: string, apiKey: string, voiceId: string = "21m00Tcm4TlvDq8ikWAM") {
  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs TTS error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return audioBuffer;
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, sourceLang, targetLang, tts = false } = await req.json();
    const apiKey = Deno.env.get('ELEVEN_LABS_API_KEY');

    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    if (!text || !sourceLang || !targetLang) {
      throw new Error('Missing required parameters');
    }

    console.log(`Translating from ${sourceLang} to ${targetLang}: "${text}"`);

    // Perform translation
    const { translatedText, detectedLanguage } = await translateWithElevenLabs(
      text,
      sourceLang,
      targetLang,
      apiKey
    );

    let audioContent = null;
    if (tts) {
      console.log('Generating speech for:', translatedText);
      const audioBuffer = await textToSpeech(translatedText, apiKey);
      audioContent = Buffer.from(audioBuffer).toString('base64');
    }

    return new Response(
      JSON.stringify({
        translatedText,
        detectedLanguage,
        audioContent
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in translate-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
