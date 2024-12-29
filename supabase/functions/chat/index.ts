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

    console.log('Message reçu:', lastMessage.content);

    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
    if (!hfToken) {
      throw new Error('HuggingFace API token not configured');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `<|im_start|>user
${lastMessage.content}
<|im_end|>
<|im_start|>assistant
`,
        parameters: {
          temperature: 0.9,
          max_new_tokens: 1000,
          return_full_text: false,
          do_sample: true,
          top_p: 0.95,
          presence_penalty: 0.5,
          frequency_penalty: 0.5
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.statusText}`);
    }

    const result = await response.json();
    const aiResponse = result[0].generated_text;

    // Mise à jour du profil si nécessaire
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
            content: aiResponse,
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
            content: "Désolé, j'ai eu un petit problème 😅 On continue?",
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