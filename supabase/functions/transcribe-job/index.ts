
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { pipeline } from "npm:@huggingface/transformers@3.2.3"
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

    let summarizer;
    try {
      console.log('Initializing pipeline with model: Xenova/distilbart-cnn-12-6')
      summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6', {
        revision: 'main',
        quantized: false,
        progress_callback: (progress) => {
          console.log(`Loading model: ${Math.round(progress.progress * 100)}%`)
        }
      })
    } catch (e) {
      console.error('Pipeline initialization error:', e)
      console.error('Stack trace:', e.stack)
      throw new Error(`Failed to initialize summarization model: ${e.message}`)
    }

    if (!summarizer) {
      throw new Error('Summarizer failed to initialize')
    }

    console.log('Generating summary...')
    const summary = await summarizer(jobContent, {
      max_length: 130,
      min_length: 30,
      do_sample: false,
      truncation: true,
    })

    if (!summary || !summary[0]?.summary_text) {
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
        ai_transcription: summary[0].summary_text
      })
      .select()

    if (insertError) {
      console.error('Error inserting summary:', insertError)
      throw insertError
    }

    return new Response(
      JSON.stringify({ transcription: summary[0].summary_text }),
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
