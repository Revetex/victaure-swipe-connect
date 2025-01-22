import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId, context } = await req.json();
    console.log('Received request:', { message, userId });
    
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_API_KEY'));
    
    // Format the conversation with previous messages if available
    let conversationHistory = '';
    if (context?.previousMessages) {
      conversationHistory = context.previousMessages
        .slice(-3) // Only use last 3 messages for context
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
    }
    
    // Analyze message intent to provide better context
    const messageIntent = message.toLowerCase();
    let contextualPrompt = '';
    
    if (messageIntent.includes('travail') || messageIntent.includes('emploi') || messageIntent.includes('job')) {
      contextualPrompt = 'Focus sur les conseils en recherche d\'emploi.';
    } else if (messageIntent.includes('cv') || messageIntent.includes('curriculum') || messageIntent.includes('résumé')) {
      contextualPrompt = 'Focus sur les conseils pour améliorer le CV.';
    } else if (messageIntent.includes('entrevue') || messageIntent.includes('entretien')) {
      contextualPrompt = 'Focus sur la préparation aux entretiens d\'embauche.';
    }

    // Format the conversation for the model with improved prompting
    const conversation = `<|system|>Tu es M. Victaure, un assistant professionnel spécialisé dans l'orientation professionnelle au Québec. Instructions importantes:
- Réponds de manière naturelle et personnalisée à chaque message
- Adapte ton niveau de langage au contexte
- Pose des questions pour mieux comprendre les besoins
- Évite absolument les réponses génériques
- Utilise les informations du contexte de la conversation
${contextualPrompt}

Historique récent de la conversation:
${conversationHistory}

<|user|>${message}</s>
<|assistant|>`;

    console.log('Sending to Hugging Face:', conversation);

    const response = await hf.textGeneration({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      inputs: conversation,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.9,
        top_p: 0.95,
        repetition_penalty: 1.2,
        do_sample: true,
        stop: ["</s>", "<|user|>", "<|system|>"]
      }
    });

    console.log('Raw response:', response);

    // Clean up the response
    let cleanResponse = response.generated_text
      .replace(conversation, '')
      .replace(/<\|assistant\|>/g, '')
      .replace(/<\|user\|>.*$/s, '')
      .replace(/<\|system\|>.*$/s, '')
      .replace(/<\/s>/g, '')
      .trim();

    // Vérification de la qualité de la réponse
    if (!cleanResponse || 
        cleanResponse.length < 20 || 
        (context?.previousMessages?.length > 0 && 
         context.previousMessages[context.previousMessages.length - 1]?.content === cleanResponse)) {
      
      console.log('Response quality check failed, generating alternative response');
      
      // Deuxième tentative avec un prompt différent
      const retryConversation = `<|system|>Tu es M. Victaure, un conseiller en orientation professionnelle. 
Réponds de façon précise et personnalisée à cette question: ${message}
Utilise ton expertise pour donner des conseils pratiques et concrets.</s>
<|assistant|>`;

      const retryResponse = await hf.textGeneration({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        inputs: retryConversation,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.95,
          top_p: 0.98,
          repetition_penalty: 1.3,
          do_sample: true,
          stop: ["</s>", "<|user|>", "<|system|>"]
        }
      });

      cleanResponse = retryResponse.generated_text
        .replace(retryConversation, '')
        .replace(/<\|assistant\|>/g, '')
        .replace(/<\|user\|>.*$/s, '')
        .replace(/<\|system\|>.*$/s, '')
        .replace(/<\/s>/g, '')
        .trim();
    }

    console.log('Final cleaned response:', cleanResponse);

    return new Response(
      JSON.stringify({ 
        response: cleanResponse,
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1"
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});