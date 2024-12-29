import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";
import { checkRateLimit } from "./ai/rateLimiter";
import { sanitizeInput } from "./ai/inputSanitizer";
import { getFallbackResponse } from "./ai/fallbackResponses";

interface HuggingFaceResponse {
  generated_text: string;
}

export async function generateAIResponse(message: string, profile?: UserProfile) {
  try {
    if (!message?.trim()) {
      throw new Error('Message invalide');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    if (!checkRateLimit(user.id)) {
      throw new Error('Limite de requêtes atteinte. Veuillez réessayer dans une minute.');
    }

    const sanitizedMessage = sanitizeInput(message);
    const systemPrompt = `<|system|>Je suis un assistant IA convivial qui s'adapte naturellement à chaque conversation.

CONTEXTE:
${profile?.full_name ? `Je parle avec ${profile.full_name}` : 'Je parle avec un utilisateur'}
${profile?.role ? `qui est ${profile.role}` : ''}

OBJECTIF:
- Réponses naturelles et personnalisées
- Langage simple et accessible
- Focus sur l'aide concrète

Message: ${sanitizedMessage}</s>
<|assistant|>`;

    const { data: secretData, error: secretError } = await supabase.rpc('get_secret', {
      secret_name: 'HUGGING_FACE_API_KEY'
    });

    if (secretError || !secretData?.[0]?.secret) {
      console.error('Error fetching API key:', secretError);
      throw new Error('Configuration API manquante');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      headers: {
        'Authorization': `Bearer ${secretData[0].secret}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.8,
          top_p: 0.9,
          repetition_penalty: 1.1,
          top_k: 40,
          do_sample: true,
          return_full_text: false,
          stop: ["</s>", "<|im_end|>"]
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error Response:', errorData);
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    const responseData = await response.json() as HuggingFaceResponse[];

    if (!Array.isArray(responseData) || !responseData[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }

    const generatedText = responseData[0].generated_text
      .split('<|assistant|>')[1]?.trim()
      .replace(/```/g, '')
      .replace(/\n\n+/g, '\n\n')
      .trim();
    
    if (!generatedText) {
      throw new Error('Aucune réponse générée');
    }

    return generatedText;
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);
    return getFallbackResponse(profile);
  }
}