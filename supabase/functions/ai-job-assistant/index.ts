import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, category } = await req.json();
    console.log('Generating description for:', { title, category });

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('Missing Hugging Face API key');
    }

    const prompt = `En tant que recruteur professionnel au Québec, génère une description de poste détaillée en français pour un poste de "${title}" dans la catégorie "${category}". 
    La description doit inclure:
    - Un bref aperçu du poste
    - 3-4 responsabilités principales
    - 2-3 qualifications requises
    Format: description simple, sans puces ni titres.`;

    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/QwQ-32B-Preview', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.9,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Hugging Face API Error:', error);
      throw new Error('Failed to generate description');
    }

    const data = await response.json();
    console.log('Generated description:', data);

    const description = data[0].generated_text.trim();

    return new Response(
      JSON.stringify({ description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in job description generation:', error);
    return new Response(
      JSON.stringify({ 
        error: "Une erreur est survenue lors de la génération de la description",
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});