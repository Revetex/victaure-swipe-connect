
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0';
import { corsHeaders } from '../_shared/cors.ts';

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface RequestBody {
  messages: Message[];
  userId?: string;
  userProfile?: {
    full_name?: string;
  };
}

console.log("Starting victaure-chat function");

// Création du client OpenAI
const openAIKey = Deno.env.get('OPENAI_API_KEY');
if (!openAIKey) {
  console.error("OPENAI_API_KEY is not set");
  throw new Error("OPENAI_API_KEY is not set");
}

const configuration = new Configuration({
  apiKey: openAIKey,
});

const openai = new OpenAIApi(configuration);

serve(async (req) => {
  console.log("Received request:", req.method);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, userId, userProfile } = await req.json() as RequestBody;
    console.log("Received message payload:", {
      messageCount: messages.length,
      userId: userId ? 'present' : 'absent',
      hasProfile: !!userProfile
    });

    // Validation des données
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format");
      throw new Error("Messages must be an array");
    }

    // Ajout de contexte supplémentaire si l'utilisateur est connecté
    let systemContext = messages[0].content;
    if (userId && userProfile?.full_name) {
      systemContext = `${systemContext}\nVous parlez à ${userProfile.full_name}.`;
    }
    messages[0].content = systemContext;

    console.log("Preparing OpenAI request");
    
    // Appel à l'API OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      })),
      temperature: 0.7,
      max_tokens: 500,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
    });

    console.log("OpenAI response received:", {
      status: completion.status,
      hasChoices: !!completion.data.choices?.length
    });

    // Vérification de la réponse
    if (!completion.data.choices || completion.data.choices.length === 0) {
      console.error("No response from OpenAI");
      throw new Error("No response generated");
    }

    // Log pour debug
    console.log("Sending response back to client");

    // Retour de la réponse
    return new Response(
      JSON.stringify({
        choices: completion.data.choices,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    );

  } catch (error) {
    console.error("Error in victaure-chat function:", error);
    
    // Formatage détaillé de l'erreur
    const errorMessage = error instanceof Error ? 
      {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : 
      { message: "An unknown error occurred" };

    return new Response(
      JSON.stringify({
        error: errorMessage
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    );
  }
});

