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
    const { message, userId, context } = await req.json();
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

    const prompt = `Tu es M. Victaure, un conseiller en orientation professionnel québécois sympathique et chaleureux.

Contexte de la conversation:
${conversationHistory}

Nouvelle question: ${message}

Instructions:
- Réponds de manière naturelle et chaleureuse
- Utilise un français québécois authentique
- Sois empathique et à l'écoute
- Donne des conseils pratiques et personnalisés
- Si tu ne comprends pas quelque chose, pose des questions pour clarifier

Réponse:`;

    console.log('Envoi de la requête à Mixtral...');

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.9,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      console.error('Erreur API:', await response.text());
      throw new Error('Erreur API Hugging Face');
    }

    const data = await response.json();
    
    if (!data?.[0]?.generated_text) {
      console.error('Réponse invalide:', data);
      throw new Error('Format de réponse invalide');
    }

    let aiResponse = data[0].generated_text.trim();

    // Nettoyer la réponse
    aiResponse = aiResponse
      .replace(/^Réponse:\s*/i, '')
      .replace(/^M\. Victaure:\s*/i, '')
      .trim();

    console.log('Réponse générée:', aiResponse);

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
          previousMessages: previousMessages
        }
      });

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur:', error);
    
    // Message d'erreur plus naturel et varié
    const errorMessages = [
      "Désolé, j'ai un petit pépin technique. On réessaie?",
      "Oups! Je suis un peu mêlé là. Peux-tu répéter s'il te plaît?",
      "Excuse-moi, j'ai eu un blanc. On reprend?",
      "Je m'excuse, j'ai eu un petit bug. On continue notre discussion?",
      "Pardonne-moi, j'ai perdu le fil. Tu peux reformuler?"
    ];
    
    const randomMessage = errorMessages[Math.floor(Math.random() * errorMessages.length)];
    
    return new Response(
      JSON.stringify({ response: randomMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});