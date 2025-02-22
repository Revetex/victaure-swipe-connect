
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { token } = await req.json()

    // Récupérer la clé API ALTCHA
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'ALTCHA_API_KEY' })

    if (secretError) {
      throw new Error('Erreur lors de la récupération de la clé API ALTCHA')
    }

    const ALTCHA_API_KEY = secretData.secret

    // Vérifier le token ALTCHA
    const verifyResponse = await fetch('https://api.altcha.org/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ALTCHA_API_KEY}`
      },
      body: JSON.stringify({ token })
    })

    const verification = await verifyResponse.json()

    return new Response(
      JSON.stringify({ success: verification.success }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
