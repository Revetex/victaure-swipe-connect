import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { skills, experiences, education } = await req.json()
    
    // Validate input
    console.log('Processing request with data:', { 
      skillsCount: skills?.length, 
      experiencesCount: experiences?.length,
      educationCount: education?.length 
    })

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY')
    if (!apiKey) {
      console.error('Missing Hugging Face API key')
      throw new Error('Configuration error: Missing API key')
    }

    const prompt = `En tant que professionnel québécois, générez une bio professionnelle concise et engageante en français québécois basée sur ces informations:

Compétences: ${skills?.join(', ') || 'Non spécifiées'}
Expériences: ${experiences?.map((exp: any) => `${exp.position} chez ${exp.company}`).join(', ') || 'Non spécifiées'}
Formation: ${education?.map((edu: any) => `${edu.degree} en ${edu.field_of_study || ''} à ${edu.school_name}`).join(', ') || 'Non spécifiée'}

La bio doit:
- Être rédigée en français québécois professionnel
- Mettre l'accent sur les réalisations et l'expertise
- Inclure des expressions typiquement québécoises appropriées
- Être adaptée au marché du travail québécois
- Rester concise (maximum 3 phrases)
- Ne pas inclure de notes ou de remarques à la fin
- Utiliser un ton professionnel mais chaleureux`

    console.log('Sending request to Hugging Face API with prompt length:', prompt.length)

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
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        }),
      }
    )

    console.log('Hugging Face API Response Status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API Error Response:', errorText)
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Received response from Hugging Face:', data)

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Unexpected API response format:', data)
      throw new Error('Invalid response format from API')
    }

    let bio = data[0].generated_text.trim()
    bio = bio.split(/Note:|Remarque:|N\.B\.:|\n\n/)[0].trim()

    console.log('Generated bio:', bio)

    return new Response(
      JSON.stringify({ bio }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
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
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    )
  }
})