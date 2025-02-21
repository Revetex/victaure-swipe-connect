
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
    const { cvContent, jobDescription } = await req.json()

    const systemPrompt = `Tu es un expert en recrutement et en analyse de CV.
    Analyse le CV fourni et compare-le au poste recherché.
    Fournis une analyse détaillée incluant :
    1. Correspondance avec le poste (score sur 100)
    2. Points forts du candidat
    3. Compétences manquantes
    4. Suggestions d'amélioration concrètes
    5. Formations recommandées
    
    Réponds en français de manière structurée.`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://victaure.com",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `CV: ${cvContent}\n\nPoste recherché: ${jobDescription}` }
        ],
      }),
    })

    const data = await response.json()
    console.log("CV Analysis:", data)

    return new Response(JSON.stringify({
      analysis: data.choices[0].message.content,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Error:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
