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

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant spécialisé dans l'amélioration des profils professionnels.
            Analyse le profil fourni et suggère des améliorations pour:
            - Corriger l'orthographe et la grammaire
            - Améliorer la clarté et le professionnalisme
            - Standardiser les adresses et informations de contact
            - Enrichir la description des compétences
            Fournis une liste de suggestions et un profil corrigé.`
          },
          {
            role: 'user',
            content: JSON.stringify(profile)
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiData = await openAIResponse.json();
    const aiSuggestions = aiData.choices[0].message.content;

    // Parse the AI response to extract suggestions and corrections
    const suggestions = [];
    let correctedProfile = { ...profile };

    try {
      const parsedResponse = JSON.parse(aiSuggestions);
      if (parsedResponse.suggestions) {
        suggestions.push(...parsedResponse.suggestions);
      }
      if (parsedResponse.correctedProfile) {
        correctedProfile = parsedResponse.correctedProfile;
      }
    } catch (e) {
      // If parsing fails, treat the entire response as suggestions
      suggestions.push(aiSuggestions);
    }

    return new Response(
      JSON.stringify({
        suggestions,
        correctedProfile
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in ai-profile-review function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});