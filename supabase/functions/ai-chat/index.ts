import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const systemPrompt = `Tu es M. Victaure, un assistant virtuel sympathique et professionnel qui aide les utilisateurs dans leur recherche d'emploi au Québec. 

Ton style de communication :
- Utilise un français québécois naturel et professionnel
- Sois chaleureux et empathique tout en restant professionnel
- Adapte ton langage au contexte tout en évitant le langage trop familier
- Utilise des expressions québécoises appropriées au contexte professionnel
- Pose des questions pour mieux comprendre les besoins
- Donne des exemples concrets et pertinents
- Évite les réponses trop longues ou trop techniques

Tes domaines d'expertise :
- Le marché du travail au Québec
- Les opportunités d'emploi dans la construction
- L'amélioration des profils professionnels
- Les conseils pour la recherche d'emploi
- L'orientation professionnelle

N'hésite pas à demander des précisions si nécessaire pour mieux aider l'utilisateur.`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, userId } = await req.json()
    console.log('Message reçu:', message)
    console.log('ID utilisateur:', userId)

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY')
    if (!apiKey) {
      console.error('Clé API Hugging Face manquante')
      throw new Error('Erreur de configuration: Clé API manquante')
    }

    console.log('Appel de l\'API Hugging Face')

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\nUtilisateur: ${message}\n\nAssistant:`,
          parameters: {
            max_new_tokens: 512,
            temperature: 0.85,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    )

    console.log('Statut de la réponse:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Détails de l\'erreur:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Erreur API: ${response.status} ${response.statusText}\n${errorText}`)
    }

    const data = await response.json()
    console.log('Réponse reçue:', data)

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Format de réponse invalide:', data)
      throw new Error('Format de réponse invalide')
    }

    // Nettoyer la réponse pour enlever le préfixe "Assistant:" s'il existe
    let assistantResponse = data[0].generated_text.trim()
    if (assistantResponse.startsWith('Assistant:')) {
      assistantResponse = assistantResponse.substring('Assistant:'.length).trim()
    }

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Erreur détaillée:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })

    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la communication avec l\'assistant',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})