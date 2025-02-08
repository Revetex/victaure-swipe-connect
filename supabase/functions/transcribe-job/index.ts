
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { pipeline } from "@huggingface/transformers"
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

    console.log('Initializing transcriber pipeline...')
    const transcriber = await pipeline(
      "summarization",
      "sshleifer/distilbart-cnn-12-6"
    )

    console.log('Generating transcription...')
    const transcription = await transcriber(jobContent, {
      max_length: 130,
      min_length: 30,
      do_sample: false
    })

    console.log('Transcription generated:', transcription)

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
        ai_transcription: transcription[0].summary_text
      })

    if (insertError) throw insertError

    return new Response(
      JSON.stringify({ transcription: transcription[0].summary_text }),
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
