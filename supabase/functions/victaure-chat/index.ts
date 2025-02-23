
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai";

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
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    console.log('Processing chat request with Gemini, messages:', JSON.stringify(messages, null, 2));

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Convertir les messages pour le format de l'historique Gemini
    const formattedMessages = messages.reduce((acc: string[], msg: Message) => {
      // Si c'est un message système, l'ajouter comme contexte au premier message utilisateur
      if (msg.role === 'system') {
        acc.push(`Context: ${msg.content}`);
      } else if (msg.role === 'user') {
        acc.push(msg.content);
      }
      return acc;
    }, []);

    console.log('Starting chat with formatted messages:', formattedMessages);

    try {
      const result = await model.generateContent(formattedMessages.join('\n'));
      const response = await result.response;
      const text = response.text();

      console.log('Gemini response:', text);

      // Format the response to match the OpenAI format expected by the frontend
      const formattedResponse = {
        choices: [
          {
            message: {
              role: 'assistant',
              content: text
            }
          }
        ]
      };

      return new Response(JSON.stringify(formattedResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (aiError) {
      console.error('Gemini API error:', aiError);
      throw new Error(`Erreur lors de la génération du contenu: ${aiError.message}`);
    }

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
