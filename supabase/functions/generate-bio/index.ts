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
    const { skills, experiences, education, certifications, options } = await req.json()
    
    console.log('Received profile data:', { skills, experiences, education, certifications, options })

    const huggingFaceApiKey = Deno.env.get('HUGGING_FACE_API_KEY')
    if (!huggingFaceApiKey) {
      throw new Error('Hugging Face API key not configured')
    }

    const prompt = `Tu es un expert en rédaction de profils professionnels québécois. Génère une bio professionnelle percutante basée sur ces informations:

${skills && skills.length > 0 ? `Compétences principales: ${skills.join(', ')}` : ''}

${experiences && experiences.length > 0 ? `Expérience professionnelle:
${experiences.map(exp => 
  `- ${exp.position} chez ${exp.company}${exp.description ? ` - ${exp.description}` : ''} (${exp.start_date || 'Date non spécifiée'} - ${exp.end_date || 'Présent'})`
).join('\n')}` : ''}

${education && education.length > 0 ? `Formation:
${education.map(edu => 
  `- ${edu.degree}${edu.field_of_study ? ` en ${edu.field_of_study}` : ''} à ${edu.school_name}`
).join('\n')}` : ''}

${certifications && certifications.length > 0 ? `Certifications:
${certifications.map(cert => 
  `- ${cert.title} (${cert.issuer})`
).join('\n')}` : ''}

Style souhaité: ${options?.style || 'professionnel'}
Longueur maximale: ${options?.maxLength || 500} caractères
Format: ${options?.format || 'paragraphes'}
Ton: ${options?.tone || 'confiant'}

Directives:
- Longueur: 2-3 phrases maximum
- Ton: professionnel mais chaleureux
- Style: première personne du singulier
- Mettre en avant: expertise principale et réalisations clés
- Inclure: une touche personnelle qui reflète la passion pour le domaine
- Adapter: au contexte québécois
- Éviter: les clichés et le jargon trop technique`

    console.log('Sending prompt to Hugging Face:', prompt)

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: options?.creativity || 0.7,
          top_p: 0.95,
          return_full_text: false,
          do_sample: true,
        }
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API error response:', errorText)
      throw new Error(`Erreur lors de la génération: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Hugging Face API Response:', data)

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Invalid response format:', data)
      throw new Error('Format de réponse invalide')
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
        details: error.message
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