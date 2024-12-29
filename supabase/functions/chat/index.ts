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

    // Use Perplexity API for more natural conversations
    const perplexityKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityKey) {
      throw new Error('Perplexity API key not configured');
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Tu es Mr Victaure, un assistant IA sympathique et naturel. Adapte ton langage et ton ton en fonction du contexte de la conversation.'
          },
          ...messages.map((m: any) => ({
            role: m.sender === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }))
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message;

    // Extract any profile updates from the conversation if relevant
    if (lastMessage.content.toLowerCase().includes('profil') || 
        lastMessage.content.toLowerCase().includes('ville') || 
        lastMessage.content.toLowerCase().includes('habite')) {
      const cityMatch = lastMessage.content.match(/(?:à|a|dans|de)\s+([A-Za-zÀ-ÿ\s-]+)(?:\s|$)/i);
      if (cityMatch) {
        await supabase
          .from('profiles')
          .update({ city: cityMatch[1].trim() })
          .eq('id', user.id);
      }
    }

    return new Response(
      JSON.stringify({
        choices: [{
          message: {
            role: 'assistant',
            content: aiResponse.content,
            action: 'chat'
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