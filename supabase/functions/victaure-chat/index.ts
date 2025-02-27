
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from "https://esm.sh/@huggingface/inference@2.3.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type } = await req.json();
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'));

    // Construire le prompt à partir des messages
    const conversationHistory = messages
      .map((msg: { role: string; content: string }) => 
        `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}`
      )
      .join('\n');

    const systemPrompt = `Tu es un assistant professionnel qui aide les utilisateurs avec leur inscription sur Victaure. Réponds de manière concise et claire en français.

Historique de la conversation:
${conversationHistory}