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
    
    console.log('Received profile data:', { skills, experiences, education })

    const huggingFaceApiKey = Deno.env.get('HUGGING_FACE_API_KEY')
    if (!huggingFaceApiKey) {
      throw new Error('Hugging Face API key not configured')
    }

    // Construct the prompt with the profile information
    const prompt = `Tu es un expert en rédaction de profils professionnels québécois. Génère une bio professionnelle basée sur ces informations:

Compétences: ${skills ? skills.join(', ') : 'Non spécifiées'}
${experiences && experiences.length > 0 ? `Expériences: ${experiences.map(exp => 
  `${exp.position} chez ${exp.company} (${exp.start_date} - ${exp.end_date || 'Présent'})`
).join(', ')}` : 'Pas d\'expérience professionnelle spécifiée'}
${education && education.length > 0 ? `Formation: ${education.map(edu => 
  `${edu.degree} en ${edu.field_of_study} à ${edu.school_name}`
).join(', ')}` : 'Pas de formation spécifiée'}

La bio doit:
- Être adaptée au marché du travail québécois
- Rester concise (maximum 3 phrases)
- Utiliser un ton professionnel mais chaleureux
- Mettre en valeur les points forts du profil`

    console.log('Sending prompt to Hugging Face:', prompt)

    // Using a more specialized model for professional content generation
    const response = await fetch('https://api-inference.huggingface.co/models/Qwen/QwQ-32B-Preview', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
          repetition_penalty: 1.2,
          do_sample: true,
          top_k: 50
        }
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Hugging Face API error:', error)
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Hugging Face API Response:', data)

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide de l\'API')
    }

    const bio = data[0].generated_text.trim()

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
        error: 'Une erreur est survenue lors de la génération de la bio',
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