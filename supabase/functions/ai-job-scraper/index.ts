
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@4.11.1";

const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const configuration = new Configuration({ apiKey: openAiApiKey });
const openai = new OpenAIApi(configuration);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription } = await req.json();
    
    // Analyse AI du job
    const prompt = `
      Analyze this job description and extract key information:
      "${jobDescription}"
      
      Please provide:
      1. Required skills
      2. Experience level
      3. Job type (full-time, part-time, contract)
      4. Estimated salary range
      5. Key responsibilities
      6. Company culture indicators
      7. Benefits mentioned
      8. Technologies used
      
      Format as JSON.
    `;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a job analysis expert. Extract and structure key information from job descriptions." },
        { role: "user", content: prompt }
      ],
    });

    const analysis = completion.data.choices[0].message?.content || "";
    
    // Store in Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase
      .from('job_analyses')
      .insert({
        original_description: jobDescription,
        ai_analysis: JSON.parse(analysis),
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ 
      success: true, 
      analysis: data 
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    });

  } catch (error) {
    console.error('Error in ai-job-scraper:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
