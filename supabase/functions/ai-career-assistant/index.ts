import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { previousMessages, userProfile } = context;

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Analyze message intent and generate appropriate response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are Mr. Victaure, a career assistant specialized in construction jobs in Quebec. 
            Your role is to help users identify their skills, career aspirations, and find relevant job opportunities.
            You should ask pertinent questions about their experience, skills, and preferences.
            Based on their responses, suggest job categories and update their profile.
            You can also provide personalized job recommendations.
            Always communicate in French and maintain a professional yet friendly tone.`
          },
          ...previousMessages.map((msg: any) => ({
            role: msg.sender === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const aiResponse = await response.json();
    const assistantMessage = aiResponse.choices[0].message.content;

    // Check if we need to update the user's profile based on the conversation
    if (userProfile && message.toLowerCase().includes('oui') && previousMessages.length > 0) {
      const lastAssistantMessage = previousMessages.find((msg: any) => msg.sender === 'assistant')?.content;
      
      if (lastAssistantMessage?.includes('compétence')) {
        // Extract skills from the conversation
        const skillsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'Extract skills mentioned in the conversation as an array of strings. Only return the JSON array.'
              },
              { role: 'user', content: message }
            ],
            temperature: 0,
          }),
        });

        const skillsData = await skillsResponse.json();
        const skills = JSON.parse(skillsData.choices[0].message.content);

        // Update user profile with new skills
        if (skills.length > 0) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ skills: skills })
            .eq('id', userId);

          if (updateError) throw updateError;
        }
      }
    }

    // Search for relevant jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(5);

    if (jobsError) throw jobsError;

    // Return response with suggested jobs
    return new Response(
      JSON.stringify({
        message: assistantMessage,
        suggestedJobs: jobs
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue', details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});