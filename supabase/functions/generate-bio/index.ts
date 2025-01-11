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

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Construct the prompt with the profile information
    const prompt = `En tant qu'expert en rédaction de profils professionnels québécois, génère une bio professionnelle basée sur ces informations:

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

    console.log('Sending prompt to OpenAI:', prompt)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en rédaction de profils professionnels québécois. Tu génères des bios concises et percutantes.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      throw new Error(`Erreur OpenAI: ${error.error?.message || 'Erreur inconnue'}`)
    }

    const data = await response.json()
    console.log('OpenAI API Response:', data)

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Format de réponse invalide de l\'API')
    }

    const bio = data.choices[0].message.content.trim()

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