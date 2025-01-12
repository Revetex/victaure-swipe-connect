import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Aucun fichier téléversé' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Vérifier que c'est bien un APK
    if (!file.name.endsWith('.apk')) {
      return new Response(
        JSON.stringify({ error: 'Le fichier doit être un APK' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Toujours utiliser le même nom de fichier pour l'APK
    const { data, error: uploadError } = await supabase.storage
      .from('vcards')
      .upload('victaure.apk', file, {
        contentType: 'application/vnd.android.package-archive',
        upsert: true // Écraser si le fichier existe déjà
      })

    if (uploadError) {
      console.error('Erreur de téléversement:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Échec du téléversement', details: uploadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Obtenir l'URL publique
    const { data: { publicUrl }, error: urlError } = supabase.storage
      .from('vcards')
      .getPublicUrl('victaure.apk')

    if (urlError) {
      console.error('Erreur lors de la récupération de l\'URL:', urlError)
      return new Response(
        JSON.stringify({ error: 'Échec de la récupération de l\'URL', details: urlError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'APK téléversé avec succès',
        url: publicUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Erreur inattendue:', error)
    return new Response(
      JSON.stringify({ error: 'Une erreur inattendue est survenue', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})