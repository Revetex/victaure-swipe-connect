import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Format experiences and education for the prompt
    const experiencesText = experiences?.length > 0 
      ? experiences.map(exp => 
          `${exp.position} chez ${exp.company} (${exp.start_date} - ${exp.end_date || 'Présent'})`
        ).join(', ')
      : 'Pas d\'expérience professionnelle spécifiée';

    const educationText = education?.length > 0
      ? education.map(edu => 
          `${edu.degree} en ${edu.field_of_study} à ${edu.school_name}`
        ).join(', ')
      : 'Pas de formation spécifiée';

    const skillsText = skills?.length > 0 
      ? skills.join(', ') 
      : 'Non spécifiées';

    const prompt = `<s>[INST] Tu es un expert en rédaction de profils professionnels québécois. 
Génère une bio professionnelle concise basée sur ces informations:

Compétences: ${skillsText}
Expériences: ${experiencesText}
Formation: ${educationText}

Directives:
- Maximum 3 phrases
- Ton professionnel mais chaleureux
- Mettre en valeur les points forts
- Utiliser des expressions québécoises appropriées
- Rédiger à la première personne du singulier
- Adapter au marché du travail québécois

Génère uniquement la bio, sans autre texte. [/INST]</s>`

    console.log('Sending prompt to Hugging Face:', prompt)

    // Implement retry logic for the API call
    let lastError = null;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
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
              temperature: 0.7,
              top_p: 0.95,
              do_sample: true,
              return_full_text: false
            }
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error(`Attempt ${attempt + 1} failed:`, errorText)
          
          // If it's a 503 (model loading) and we haven't exceeded retries, wait and retry
          if (response.status === 503 && attempt < MAX_RETRIES - 1) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            continue;
          }
          
          throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}\n${errorText}`)
        }

        const data = await response.json()
        console.log('Hugging Face API Response:', data)

        if (!Array.isArray(data) || !data[0]?.generated_text) {
          throw new Error('Format de réponse invalide de l\'API')
        }

        let bio = data[0].generated_text
          .replace(/^.*\[\/INST\]/, '')
          .replace(/<s>|<\/s>/g, '')
          .trim()

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
        console.error(`Attempt ${attempt + 1} error:`, error)
        lastError = error;
        
        if (attempt < MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }

    // If we've exhausted all retries, throw the last error
    throw lastError || new Error('Maximum retry attempts exceeded')

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