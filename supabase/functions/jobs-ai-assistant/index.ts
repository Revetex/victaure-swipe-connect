
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
    const { query, userProfile, jobContext } = await req.json()

    const systemPrompt = `Tu es un assistant spécialisé dans la recherche d'emploi pour la plateforme Victaure.
    Tu dois aider les utilisateurs à trouver les meilleures opportunités en te basant sur leur profil et leurs préférences.
    
    Voici le profil de l'utilisateur :
    ${JSON.stringify(userProfile)}
    
    Contexte des emplois disponibles :
    ${JSON.stringify(jobContext)}
    
    Réponds toujours en français de manière professionnelle mais amicale.`

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://victaure.com",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query }
        ],
      }),
    })

    const data = await response.json()
    console.log("AI Response:", data)

    return new Response(JSON.stringify({
      response: data.choices[0].message.content,
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
