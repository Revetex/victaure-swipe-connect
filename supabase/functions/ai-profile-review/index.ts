import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_API_KEY')
const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1"

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { profile } = await req.json()
    
    if (!profile) {
      throw new Error('Profile data is required')
    }

    console.log('Analyzing profile:', profile)

    const prompt = `Tu es un expert en recrutement au Québec. Analyse le profil professionnel suivant et donne des suggestions d'amélioration constructives en français:

Nom: ${profile.full_name || 'Non spécifié'}
Bio: ${profile.bio || 'Non spécifiée'}
Compétences: ${profile.skills?.join(', ') || 'Non spécifiées'}
Ville: ${profile.city || 'Non spécifiée'}
Province: ${profile.state || 'Non spécifiée'}

Fournis une analyse détaillée avec:
1. Points forts du profil
2. Éléments à améliorer
3. Suggestions concrètes pour optimiser la visibilité professionnelle
4. Conseils spécifiques pour le marché du travail québécois`

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7,
          top_p: 0.95,
        },
      }),
    })

    if (!response.ok) {
      console.error('Hugging Face API error:', await response.text())
      throw new Error('Failed to analyze profile')
    }

    const result = await response.json()
    console.log('Analysis result:', result)

    // Extract the generated text from the response
    const analysis = Array.isArray(result) ? result[0].generated_text : result.generated_text

    return new Response(
      JSON.stringify({ analysis }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )

  } catch (error) {
    console.error('Error in ai-profile-review:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    )
  }
})