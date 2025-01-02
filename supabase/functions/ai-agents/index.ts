import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { JobSearchAgent } from "./agents/jobSearchAgent.ts";
import { InterfaceAgent } from "./agents/interfaceAgent.ts";
import { CommunicationAgent } from "./agents/communicationAgent.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, message } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const jobSearchAgent = new JobSearchAgent(supabaseUrl, supabaseKey);
    const interfaceAgent = new InterfaceAgent(supabaseUrl, supabaseKey);
    const communicationAgent = new CommunicationAgent(supabaseUrl, supabaseKey);

    let result;
    switch (action) {
      case 'search_jobs':
        result = await jobSearchAgent.searchJobs();
        break;
      case 'match_jobs':
        result = await interfaceAgent.matchJobsToClients();
        break;
      case 'handle_message':
        if (!userId || !message) {
          throw new Error('userId and message are required for handle_message action');
        }
        result = await communicationAgent.handleUserInteraction(message, userId);
        break;
      default:
        throw new Error('Invalid action specified');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-agents function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});