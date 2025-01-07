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
    const { skills, experiences, education } = await req.json();

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('Missing Hugging Face API key');
    }

    const prompt = `En tant que professionnel québécois, générez une bio professionnelle concise et engageante en français canadien basée sur ces informations:

Compétences: ${skills?.join(', ') || 'Non spécifiées'}
Expériences: ${experiences?.map((exp: any) => `${exp.position} chez ${exp.company}`).join(', ') || 'Non spécifiées'}
Formation: ${education?.map((edu: any) => `${edu.degree} en ${edu.field_of_study || ''} à ${edu.school_name}`).join(', ') || 'Non spécifiée'}

La bio doit:
- Être rédigée en français québécois professionnel
- Mettre l'accent sur les réalisations et l'expertise
- Inclure des expressions typiquement québécoises appropriées
- Être adaptée au marché du travail canadien
- Rester concise (maximum 3-4 phrases)`;

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 256,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Hugging Face API Error:', error);
      throw new Error('Failed to generate bio');
    }

    const data = await response.json();
    const bio = data[0].generated_text.trim();

    return new Response(
      JSON.stringify({ bio }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-bio function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Une erreur est survenue lors de la génération de la bio",
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});