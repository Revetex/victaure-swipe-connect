
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, userId, context } = await req.json()
    console.log('Received message:', message)
    console.log('User ID:', userId)
    console.log('Context:', context)

    const apiKey = Deno.env.get('HUGGING_FACE_API_KEY')
    if (!apiKey) {
      console.error('Missing HUGGING_FACE_API_KEY')
      throw new Error('Configuration error: Missing API key')
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Récupérer l'historique des messages récents
    const { data: recentMessages } = await supabase
      .from('ai_messages')
      .select('content, is_assistant')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const systemPrompt = `Tu es M. Victaure, un assistant virtuel chaleureux et naturel spécialisé dans l'orientation professionnelle au Québec.

    Ton rôle est d'être:
    - Naturel et conversationnel dans tes réponses
    - Empathique et compréhensif
    - À l'écoute des besoins de l'utilisateur
    - Expert en construction et emploi au Québec
    - Capable de maintenir une conversation fluide et cohérente
    
    DIRECTIVES IMPORTANTES:
    - Réponds toujours en français de manière naturelle
    - Adapte ton langage au niveau de formalité de l'utilisateur
    - Assure une continuité logique avec les messages précédents
    - Fais référence aux éléments mentionnés précédemment dans la conversation
    - Évite les répétitions inutiles
    - Pose des questions de suivi pertinentes
    - N'hésite pas à rebondir sur les sujets abordés précédemment
    
    Contexte de l'utilisateur:
    ${JSON.stringify(context?.userProfile || {})}
    
    Messages précédents:
    ${recentMessages?.map(m => `${m.is_assistant ? 'M. Victaure' : 'Utilisateur'}: ${m.content}`).join('\n') || 'Aucun message précédent'}
    
    Message actuel: ${message}
    
    Réponse de M. Victaure:`

    console.log('Sending prompt to Hugging Face:', systemPrompt)

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
            temperature: 0.7,
            top_p: 0.95,
            frequency_penalty: 0.3,
            presence_penalty: 0.3,
            return_full_text: false
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Hugging Face API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('AI response received:', data)

    if (!data || !Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response format from Hugging Face API')
    }

    let assistantResponse = data[0].generated_text.trim();
    
    // Stocker le message dans l'historique
    const { error: messageError } = await supabase
      .from('ai_messages')
      .insert({
        user_id: userId,
        content: message,
        is_assistant: false,
        timestamp: new Date().toISOString()
      });

    if (messageError) {
      console.error('Error storing user message:', messageError);
    }

    // Stocker la réponse de l'assistant
    const { error: responseError } = await supabase
      .from('ai_messages')
      .insert({
        user_id: userId,
        content: assistantResponse,
        is_assistant: true,
        timestamp: new Date().toISOString()
      });

    if (responseError) {
      console.error('Error storing assistant response:', responseError);
    }

    // Analyser la réponse pour le context learning
    const { error: learningError } = await supabase
      .from('ai_learning_data')
      .insert({
        user_id: userId,
        question: message,
        response: assistantResponse,
        context: context || {},
        tags: ['chat', 'career-advice']
      });

    if (learningError) {
      console.error('Error storing learning data:', learningError);
    }

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Detailed error in AI chat function:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })

    return new Response(
      JSON.stringify({ 
        error: 'Une erreur est survenue lors de la communication avec l\'API',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
