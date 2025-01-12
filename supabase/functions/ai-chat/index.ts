import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const MODEL_LOADING_STATUS = 503;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const systemPrompt = `Tu es M. Victaure, un conseiller en emploi expérimenté au Québec qui aide les professionnels dans leur recherche d'emploi et leur développement de carrière.

Ton style de communication:
- Utilise un français québécois naturel et professionnel
- Sois chaleureux, empathique et bienveillant
- Adapte ton langage au contexte tout en restant professionnel
- Pose des questions pertinentes pour mieux comprendre les besoins
- Donne des exemples concrets basés sur le marché du travail québécois
- Évite les réponses trop longues ou trop techniques
- Sois proactif dans tes suggestions

Tes domaines d'expertise:
- Le marché du travail au Québec
- Les opportunités d'emploi dans différents secteurs
- L'amélioration des profils professionnels
- Les conseils pour la recherche d'emploi
- L'orientation professionnelle
- Les tendances du marché

Règles importantes:
- Reste toujours professionnel et constructif
- Base tes conseils sur des données concrètes
- Pose des questions de suivi pertinentes
- Offre des suggestions pratiques et applicables
- Adapte tes conseils au profil et au contexte de l'utilisateur`

async function callHuggingFaceAPI(apiKey: string, message: string, retryCount = 0): Promise<string> {
  try {
    console.log(`Tentative d'appel à l'API Hugging Face (essai ${retryCount + 1}/${MAX_RETRIES})`)
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\nUtilisateur: ${message}\n\nM. Victaure:`,
          parameters: {
            max_new_tokens: 1024,
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
      console.error('Erreur de l\'API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })

      // If the model is loading and we haven't exceeded max retries
      if (response.status === MODEL_LOADING_STATUS && retryCount < MAX_RETRIES) {
        try {
          const errorJson = JSON.parse(errorText);
          const estimatedTime = errorJson.estimated_time || RETRY_DELAY;
          console.log(`Modèle en cours de chargement, nouvelle tentative dans ${Math.ceil(estimatedTime/1000)} secondes...`)
          await sleep(Math.min(estimatedTime, RETRY_DELAY))
          return callHuggingFaceAPI(apiKey, message, retryCount + 1)
        } catch (parseError) {
          console.error('Erreur lors du parsing de l\'erreur:', parseError)
          await sleep(RETRY_DELAY)
          return callHuggingFaceAPI(apiKey, message, retryCount + 1)
        }
      }

      throw new Error(`Erreur API: ${response.status} ${response.statusText}\n${errorText}`)
    }

    const data = await response.json()
    console.log('Réponse reçue:', data)

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide')
    }

    let assistantResponse = data[0].generated_text.trim()
    if (assistantResponse.startsWith('M. Victaure:')) {
      assistantResponse = assistantResponse.substring('M. Victaure:'.length).trim()
    }

    return assistantResponse
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Erreur lors de l'appel API, nouvelle tentative dans ${RETRY_DELAY/1000} secondes... (${error.message})`)
      await sleep(RETRY_DELAY)
      return callHuggingFaceAPI(apiKey, message, retryCount + 1)
    }
    throw error
  }
}

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
    const assistantResponse = await callHuggingFaceAPI(apiKey, message)

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