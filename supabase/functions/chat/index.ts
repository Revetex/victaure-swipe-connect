import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
    if (userError || !user) {
      throw new Error('Invalid user');
    }

    console.log('Processing message:', lastMessage.content);

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Generate a natural response based on the conversation context
    let response = {
      content: lastMessage.content.toLowerCase().includes('profil') 
        ? `Je vois que vous souhaitez parler de votre profil${profile?.full_name ? ', ' + profile.full_name : ''}. Comment puis-je vous aider avec cela ?`
        : `Je comprends votre message. Comment puis-je vous aider davantage ?`,
      action: 'chat'
    };

    // If the message contains profile information, try to update it
    if (lastMessage.content.toLowerCase().includes('ville') || 
        lastMessage.content.toLowerCase().includes('habite')) {
      const cityMatch = lastMessage.content.match(/(?:à|a|dans|de)\s+([A-Za-zÀ-ÿ\s-]+)(?:\s|$)/i);
      if (cityMatch) {
        await supabase
          .from('profiles')
          .update({ city: cityMatch[1].trim() })
          .eq('id', user.id);
        
        response.action = 'update_city';
      }
    }

    return new Response(
      JSON.stringify({
        choices: [{
          message: {
            role: 'assistant',
            content: response.content,
            action: response.action
          }
        }]
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        choices: [{
          message: {
            role: 'assistant',
            content: "Je suis désolé, j'ai rencontré une erreur. Comment puis-je vous aider autrement ?",
            action: 'error'
          }
        }]
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});