import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log('Question reçue:', message);

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!apiKey) {
      throw new Error('Configuration API incorrecte');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer le profil de l'utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Récupérer les derniers messages pour le contexte
    const { data: previousMessages } = await supabase
      .from('ai_chat_messages')
      .select('content, sender')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const conversationHistory = previousMessages ? previousMessages.reverse().map(msg => 
      `${msg.sender === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}`
    ).join('\n') : '';

    const systemPrompt = `Tu es M. Victaure, un conseiller en orientation professionnel québécois sympathique et chaleureux.
Tu dois absolument répondre en utilisant un français québécois authentique, avec des expressions typiquement québécoises.

Voici quelques règles importantes:
1. Utilise "tu" au lieu de "vous" pour être plus familier
2. Utilise des expressions québécoises comme "ben", "tsé", "faque", "pis"
3. Sois chaleureux et empathique
4. Donne des conseils pratiques et personnalisés
5. Si tu ne comprends pas quelque chose, pose des questions pour clarifier
6. Évite les réponses trop formelles ou génériques

Historique de la conversation:
${conversationHistory}

Question: ${message}

Réponds de manière naturelle et chaleureuse, comme un vrai Québécois:`;

    console.log('Envoi de la requête à Mixtral avec le prompt:', systemPrompt);

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: systemPrompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.8,
            top_p: 0.95,
            repetition_penalty: 1.2,
            do_sample: true
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur API Hugging Face:', errorText);
      throw new Error('Erreur de communication avec le modèle');
    }

    const data = await response.json();
    console.log('Réponse brute reçue:', data);
    
    if (!data?.[0]?.generated_text) {
      console.error('Format de réponse invalide:', data);
      throw new Error('Format de réponse invalide');
    }

    let aiResponse = data[0].generated_text.trim();
    console.log('Réponse avant nettoyage:', aiResponse);

    // Extraire uniquement la partie après la dernière occurrence de "Question:" ou "Assistant:"
    const lastQuestionIndex = aiResponse.lastIndexOf('Question:');
    const lastAssistantIndex = aiResponse.lastIndexOf('Assistant:');
    const lastIndex = Math.max(lastQuestionIndex, lastAssistantIndex);
    
    if (lastIndex !== -1) {
      aiResponse = aiResponse.substring(lastIndex);
    }

    // Nettoyer la réponse
    aiResponse = aiResponse
      .replace(/^Question:.*$/m, '')
      .replace(/^Assistant:?\s*/i, '')
      .replace(/^M\.\s*Victaure:?\s*/i, '')
      .replace(/^Réponse:?\s*/i, '')
      .trim();

    // Vérifier que la réponse n'est pas vide après nettoyage
    if (!aiResponse) {
      console.error('Réponse vide après nettoyage');
      throw new Error('Réponse invalide générée');
    }

    console.log('Réponse finale nettoyée:', aiResponse);

    // Sauvegarder l'interaction
    await supabase
      .from('ai_learning_data')
      .insert({
        user_id: userId,
        question: message,
        response: aiResponse,
        context: {
          model: 'Mixtral-8x7B-Instruct-v0.1',
          profile: profile,
          previousMessages: previousMessages,
          prompt: systemPrompt
        }
      });

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur détaillée:', error);
    
    const errorMessages = [
      "Désolé mon ami, y'a eu un p'tit bug. Peux-tu réessayer?",
      "Oups! J'ai eu un pépin technique. On reprend?",
      "Ben là, j'ai eu un blanc. Tu peux reformuler?",
      "Tabarnouche! Mon système a bogué. On réessaye-tu?",
      "Excuse-moi, j'ai perdu le fil. On recommence?"
    ];
    
    const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        response: randomMessage 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});