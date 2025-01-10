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
    const { profile } = await req.json();
    console.log('Received profile for review:', profile);

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('Missing Hugging Face API key');
    }

    const prompt = `En tant qu'expert en ressources humaines au Québec, analyse ce profil professionnel et suggère des améliorations pour:
    - Corriger l'orthographe et la grammaire
    - Améliorer la clarté et le professionnalisme
    - Standardiser les adresses et informations de contact
    - Enrichir la description des compétences
    
    Profil à analyser:
    ${JSON.stringify(profile, null, 2)}
    
    Format de réponse souhaité:
    {
      "suggestions": ["suggestion 1", "suggestion 2", ...],
      "correctedProfile": {
        // profil corrigé avec les mêmes champs que l'original
      }
    }`;

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 1024,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Hugging Face API Error:', error);
      throw new Error('Failed to analyze profile');
    }

    const data = await response.json();
    console.log('AI response:', data);

    let result;
    try {
      // Try to parse the AI response as JSON
      const aiResponse = JSON.parse(data[0].generated_text);
      result = {
        suggestions: aiResponse.suggestions || [],
        correctedProfile: aiResponse.correctedProfile || profile
      };
    } catch (e) {
      // If parsing fails, extract suggestions from the text response
      console.log('Failed to parse AI response as JSON, using text format');
      const suggestions = data[0].generated_text
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim().substring(2));

      result = {
        suggestions: suggestions,
        correctedProfile: profile
      };
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in ai-profile-review function:', error);
    return new Response(
      JSON.stringify({ 
        error: "Une erreur est survenue lors de l'analyse du profil",
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});