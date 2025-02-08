
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2"
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

    console.log(`Starting summarization for job ${jobId}...`)
    console.log('Content length:', jobContent.length)

    // Initialize HuggingFace Inference API client
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_API_KEY'))

    // Generate summary using the Inference API
    console.log('Generating summary using Hugging Face Inference API...')
    const response = await hf.summarization({
      model: 'facebook/bart-large-cnn',
      inputs: jobContent,
      parameters: {
        max_length: 130,
        min_length: 30,
        do_sample: false
      }
    })

    if (!response || !response.summary_text) {
      throw new Error('Failed to generate summary')
    }

    console.log('Summary generated successfully')

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Store the summary
    const { error: insertError } = await supabaseAdmin
      .from('job_transcriptions')
      .insert({
        job_id: jobId,
        ai_transcription: response.summary_text
      })
      .select()

    if (insertError) {
      console.error('Error inserting summary:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({ transcription: response.summary_text }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    console.error('Stack trace:', error.stack)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
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
