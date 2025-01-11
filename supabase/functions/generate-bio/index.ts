import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { skills, experiences, education } = await req.json()
    
    console.log('Processing request with data:', { 
      skillsCount: skills?.length, 
      experiencesCount: experiences?.length,
      educationCount: education?.length 
    })

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY')
    if (!apiKey) {
      throw new Error('Configuration error: Missing API key')
    }

    const formattedExperiences = experiences?.map((exp: any) => 
      `${exp.position} chez ${exp.company} (${exp.start_date ? new Date(exp.start_date).getFullYear() : 'N/A'} - ${exp.end_date ? new Date(exp.end_date).getFullYear() : 'présent'})`
    ).join(', ') || 'Non spécifiées';

    const formattedEducation = education?.map((edu: any) => 
      `${edu.degree}${edu.field_of_study ? ` en ${edu.field_of_study}` : ''} à ${edu.school_name}`
    ).join(', ') || 'Non spécifiée';

    const prompt = `En tant que professionnel québécois, générez une bio professionnelle concise et engageante en français québécois basée sur ces informations:

Compétences: ${(skills || []).join(', ') || 'Non spécifiées'}
Expériences: ${formattedExperiences}
Formation: ${formattedEducation}

La bio doit:
- Être rédigée en français québécois professionnel
- Mettre l'accent sur les réalisations et l'expertise
- Inclure des expressions typiquement québécoises appropriées
- Être adaptée au marché du travail québécois
- Rester concise (maximum 3 phrases)
- Ne pas inclure de notes ou de remarques à la fin
- Utiliser un ton professionnel mais chaleureux`;

    console.log('Sending prompt to Hugging Face:', prompt);

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
            max_new_tokens: 256,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API Error Response:', errorText)
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Hugging Face API Response:', data);
    
    if (!Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Invalid response format:', data);
      throw new Error('Format de réponse invalide de l\'API')
    }

    let bio = data[0].generated_text.trim()
    // Remove any system messages or notes that might appear after double newlines
    bio = bio.split(/Note:|Remarque:|N\.B\.:|\n\n/)[0].trim()

    return new Response(
      JSON.stringify({ bio }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-bio function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: "Une erreur est survenue lors de la génération de la bio",
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})