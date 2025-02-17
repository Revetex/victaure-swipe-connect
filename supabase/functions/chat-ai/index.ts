
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Fetch recent scraped jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('scraped_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (jobsError) throw jobsError;

    let response = '';

    // Check if message contains job-related keywords
    const jobKeywords = ['emploi', 'job', 'travail', 'poste', 'offre'];
    const isJobQuery = jobKeywords.some(keyword => message.toLowerCase().includes(keyword));

    if (isJobQuery && jobs.length > 0) {
      response = `J'ai trouvé quelques emplois qui pourraient vous intéresser :\n\n`;
      jobs.forEach((job, index) => {
        response += `${index + 1}. ${job.title}\n`;
        response += `   🏢 ${job.company}\n`;
        response += `   📍 ${job.location}\n`;
        if (job.salary_range) {
          response += `   💰 ${job.salary_range}\n`;
        }
        response += `   🔗 ${job.url}\n\n`;
      });
      response += `\nVoulez-vous que je vous aide à postuler à l'un de ces emplois ?`;
    } else {
      response = `Bonjour ${profile.full_name || 'cher utilisateur'}, je suis M. Victaure, votre assistant personnel. Je peux vous aider à trouver des emplois, analyser des offres d'emploi ou vous donner des conseils professionnels. Que puis-je faire pour vous ?`;
    }

    // Log the interaction
    await supabase.from('ai_chat_messages').insert({
      user_id: userId,
      content: message,
      sender: 'user'
    });

    await supabase.from('ai_chat_messages').insert({
      user_id: userId,
      content: response,
      sender: 'assistant'
    });

    console.log('Response generated:', response);

    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
