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
    const { 
      full_name,
      role,
      skills,
      experiences,
      education,
      certifications,
      city,
      state,
      country,
      industry
    } = await req.json();

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('Missing Hugging Face API key');
    }

    // Format location
    const location = [city, state, country].filter(Boolean).join(', ');

    // Format latest experience
    const latestExperience = experiences?.[0] ? 
      `${experiences[0].position} chez ${experiences[0].company}` : '';

    // Format education
    const latestEducation = education?.[0] ? 
      `${education[0].degree} en ${education[0].field_of_study || ''} à ${education[0].school_name}` : '';

    // Format certifications
    const certificationsList = certifications?.map((cert: any) => cert.title).join(', ') || '';

    const prompt = `En tant que professionnel québécois, générez une bio professionnelle concise et engageante en français québécois basée sur ces informations:

Nom: ${full_name || 'Non spécifié'}
Rôle: ${role || 'Professionnel'}
Localisation: ${location || 'Québec, Canada'}
Industrie: ${industry || 'Non spécifiée'}

Compétences principales: ${skills?.slice(0, 5).join(', ') || 'Non spécifiées'}
Expérience actuelle: ${latestExperience || 'Non spécifiée'}
Formation: ${latestEducation || 'Non spécifiée'}
Certifications: ${certificationsList || 'Non spécifiées'}

La bio doit:
- Être rédigée en français québécois professionnel
- Mettre l'accent sur l'expertise et les réalisations principales
- Inclure des expressions typiquement québécoises appropriées
- Être adaptée au marché du travail québécois
- Rester concise (maximum 3-4 phrases)
- Mentionner la localisation et l'industrie si spécifiées
- Avoir un ton professionnel mais chaleureux
- Ne pas inclure de notes ou de remarques à la fin`;

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
    let bio = data[0].generated_text.trim();
    
    // Remove any notes or remarks that might appear after the main bio
    bio = bio.split(/Note:|Remarque:|N\.B\.:|\n\n/)[0].trim();

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