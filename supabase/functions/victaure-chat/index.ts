
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from '../_shared/cors.ts';

const TIMEOUT_DURATION = 25000;
const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');

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

console.log("Starting victaure-chat function with OpenRouter (Gemini)");

if (!OPENROUTER_API_KEY) {
  console.error("OPENROUTER_API_KEY is not set");
  throw new Error("OPENROUTER_API_KEY is not set");
}

async function fetchWithTimeout(promise: Promise<any>, timeout: number) {
  let timeoutId: number;
  
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeout}ms`));
    }, timeout);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

serve(async (req) => {
  console.log(`[${new Date().toISOString()}] Request received:`, req.method);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, userId, userProfile } = await req.json() as RequestBody;
    
    console.log('Received request body:', { 
      messageCount: messages?.length,
      firstMessage: messages?.[0],
      userId,
      userProfile 
    });

    if (!messages?.length) {
      throw new Error("Messages array is required and must not be empty");
    }

    const systemContext = `Tu es Mr Victaure, un assistant professionnel hautement qualifié spécialisé dans le conseil en carrière et le recrutement. 

Ton profil :
- Tu as plus de 15 ans d'expérience dans le recrutement et le développement de carrière au Canada
- Tu es diplômé en psychologie organisationnelle et en ressources humaines
- Tu maîtrises parfaitement le français et les subtilités de la communication professionnelle
- Tu es expert dans l'analyse des compétences et du potentiel professionnel

Directives de comportement :
- Reste toujours professionnel et bienveillant
- Vérifie soigneusement ta grammaire et ton orthographe
- Fournis des réponses précises et factuelles basées sur ton expertise
- Pose des questions pertinentes pour mieux comprendre les besoins
- Adapte ton niveau de langage au contexte tout en restant professionnel
- Si tu ne connais pas quelque chose avec certitude, admets-le honnêtement

${userId ? `Tu parles actuellement à ${userProfile?.full_name}.` : 'Tu parles à un visiteur.'} 

Concentre-toi sur :
- L'aide à la recherche d'emploi
- Le développement de carrière
- Les conseils en entretien
- L'analyse du marché du travail
- L'orientation professionnelle
- Les tendances de l'emploi au Canada

Évite :
- Les réponses vagues ou génériques
- Les plaisanteries inappropriées
- Les conseils non fondés
- Les sujets hors de ton domaine d'expertise`;

    const messagePayload = messages.slice(1).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    messagePayload.unshift({
      role: "system",
      content: systemContext
    });

    const payload = {
      model: "google/gemini-2.0-flash-thinking-exp:free",
      messages: messagePayload,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.5
    };

    console.log('Sending request to OpenRouter with payload:', {
      model: payload.model,
      messageCount: payload.messages.length,
      temperature: payload.temperature,
      maxTokens: payload.max_tokens
    });

    const openRouterPromise = fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'HTTP-Referer': 'https://victaure.com',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'X-Title': 'Victaure Assistant',
        'Model': 'google/gemini-2.0-flash-thinking-exp:free'
      },
      body: JSON.stringify(payload)
    });

    const response = await fetchWithTimeout(openRouterPromise, TIMEOUT_DURATION);
    
    console.log('OpenRouter response status:', response.status);
    console.log('OpenRouter response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('OpenRouter response data:', JSON.stringify(data, null, 2));

    if (!response.ok || data.error) {
      console.error('OpenRouter error details:', data.error);
      throw new Error(`OpenRouter API error: ${data.error?.message || data.error || 'Unknown error'}`);
    }

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response structure:', data);
      throw new Error("Structure de réponse invalide de OpenRouter");
    }

    const formattedResponse = {
      choices: [{
        message: {
          role: "assistant",
          content: data.choices[0].message.content
        }
      }]
    };

    return new Response(
      JSON.stringify(formattedResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error:`, error);

    const errorResponse = {
      error: {
        message: error instanceof Error ? error.message : "Une erreur inconnue s'est produite",
        name: error instanceof Error ? error.name : "UnknownError",
        timestamp: new Date().toISOString()
      }
    };

    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
