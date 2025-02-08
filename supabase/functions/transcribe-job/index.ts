
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@2.15.1"
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

    console.log('Initializing summarizer pipeline...')
    let summarizer;
    try {
      summarizer = await pipeline('summarization', 'facebook/bart-large-cnn', {
        quantized: false,
        progress_callback: (progress) => {
          console.log(`Loading model: ${Math.round(progress.progress * 100)}%`);
        }
      });
    } catch (e) {
      console.error('Detailed pipeline error:', e);
      throw new Error(`Failed to initialize summarization model: ${e.message}`);
    }

    console.log('Generating summary for job:', jobId)
    const summary = await summarizer(jobContent, {
      max_length: 130,
      min_length: 30,
      do_sample: false,
      truncation: true,
      cache_dir: '/tmp'  // Specify a temporary cache directory
    })

    console.log('Summary generated:', summary)

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
