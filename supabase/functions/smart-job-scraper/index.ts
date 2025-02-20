
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting smart job scraping...");

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Utiliser OpenRouter pour analyser les jobs
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get('OPENROUTER_API_KEY')}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Vous êtes un expert en analyse d'offres d'emploi. Analysez les offres et extrayez les informations pertinentes."
          },
          {
            role: "user",
            content: "Analysez cette liste d'emplois et donnez-moi les informations clés."
          }
        ]
      })
    });

    const data = await response.json();
    console.log("OpenRouter analysis completed:", data);

    // Mettre à jour les jobs dans la base de données
    const { error: updateError } = await supabase
      .from('jobs')
      .update({ 
        last_analysis: data.choices[0].message.content,
        updated_at: new Date().toISOString()
      })
      .eq('status', 'open');

    if (updateError) {
      throw updateError;
    }

    console.log("Jobs updated successfully");

    return new Response(JSON.stringify({ success: true, analysis: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in smart job scraper:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: corsHeaders, status: 500 }
    );
  }
});
