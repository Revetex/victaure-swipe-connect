
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { pipeline } from "https://esm.sh/@huggingface/transformers"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { jobId, jobContent } = await req.json()

    if (!jobId || !jobContent) {
      throw new Error('Job ID and content are required')
    }

    // Initialize Hugging Face pipeline
    const transcriber = await pipeline(
      "text2text-generation",
      "facebook/mbart-large-50-many-to-many-mmt"
    )

    // Generate transcription
    const transcription = await transcriber(jobContent, {
      src_lang: "fr_XX",
      tgt_lang: "fr_XX",
      max_length: 1000
    })

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store the transcription
    const { error: insertError } = await supabaseAdmin
      .from('job_transcriptions')
      .insert({
        job_id: jobId,
        ai_transcription: transcription[0].generated_text
      })

    if (insertError) throw insertError

    return new Response(
      JSON.stringify({ transcription: transcription[0].generated_text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
