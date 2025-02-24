
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getUserProfile, saveInteractionToDb } from './db.ts';
import { getRelevantInteractions } from './learning.ts';
import { buildAppContext } from './context.ts';
import { ChatMessage } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, userId } = await req.json();
    const currentUserMessage = messages[messages.length - 1]?.content || '';

    // Récupérer le profil et les interactions pertinentes
    const userProfile = userId ? await getUserProfile(userId) : null;
    const relevantInteractions = await getRelevantInteractions(currentUserMessage);
    
    // Construire le contexte de l'application
    const appContext = buildAppContext(userProfile, relevantInteractions);

    // Préparer les messages pour l'API
    const messagesWithContext: ChatMessage[] = [
      { role: "system", content: appContext },
      ...messages.slice(1)
    ];

    // Appeler l'API OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://victaure.com',
        'X-Title': 'Victaure Assistant',
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-pro-exp-02-05:free",
        messages: messagesWithContext,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();
    
    // Sauvegarder l'interaction pour l'apprentissage
    if (data?.choices?.[0]?.message?.content) {
      await saveInteractionToDb(
        currentUserMessage,
        data.choices[0].message.content,
        userId,
        { profile: userProfile }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
