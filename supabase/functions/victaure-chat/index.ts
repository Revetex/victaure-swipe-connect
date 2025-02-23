
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type = 'chat' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    console.log('Processing chat request with Gemini, messages:', JSON.stringify(messages, null, 2));

    const formattedMessages = messages.map((msg: Message) => ({
      role: msg.role === 'system' ? 'user' : msg.role, // Gemini doesn't support system role
      content: msg.content
    }));

    console.log('Formatted messages:', JSON.stringify(formattedMessages, null, 2));

    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openRouterKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://victaure.com',
        'OR-ORGANIZATION': 'victaure'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-pro-exp-02-05:free',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      }),
    });

    const data = await response.json();
    
    console.log('OpenRouter raw response:', JSON.stringify(data, null, 2));
    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorMessage = data.error?.message || 'Failed to get response from Gemini';
      console.error('OpenRouter API error:', errorMessage);
      throw new Error(errorMessage);
    }

    if (!data.choices?.[0]?.message) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from OpenRouter API');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in victaure-chat function:', error);
    return new Response(
      JSON.stringify({
        error: 'Une erreur est survenue lors du traitement de votre demande.',
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
