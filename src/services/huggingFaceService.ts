import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";
import { checkRateLimit } from "./ai/rateLimiter";
import { sanitizeInput } from "./ai/inputSanitizer";
import { buildSystemPrompt } from "./ai/promptBuilder";

export async function generateAIResponse(message: string, profile?: UserProfile) {
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
  const systemPrompt = buildSystemPrompt(profile, sanitizedMessage);

  console.log('Préparation de la requête:', {
    messageLength: sanitizedMessage.length,
    hasProfile: !!profile,
    userId: user.id
  });

  const { data: secretData, error: secretError } = await supabase.rpc('get_secret', {
    secret_name: 'HUGGING_FACE_API_KEY'
  });

  console.log('Vérification de la clé API:', { 
    hasData: !!secretData, 
    hasError: !!secretError,
    errorDetails: secretError?.message 
  });

  if (secretError) {
    console.error('Erreur lors de la récupération de la clé API:', secretError);
    throw new Error('Erreur lors de la récupération de la clé API');
  }

  if (!secretData?.[0]?.secret || secretData[0].secret.trim() === '') {
    console.error('Clé API non trouvée ou invalide');
    throw new Error('Configuration API manquante ou invalide');
  }

  const apiKey = secretData[0].secret.trim();
  console.log('Clé API récupérée avec succès');

  try {
    console.log('Envoi de la requête à Hugging Face...');
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.15,
          top_k: 50,
          do_sample: true,
          return_full_text: false,
          stop: ["</s>", "<|im_end|>", "<|user|>"]
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erreur API Hugging Face:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(`Erreur API Hugging Face: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Réponse reçue de Hugging Face:', {
      hasData: !!data,
      isArray: Array.isArray(data),
      hasGeneratedText: !!data?.[0]?.generated_text
    });

    if (!Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Format de réponse invalide:', data);
      throw new Error('Format de réponse invalide');
    }

    const generatedText = data[0].generated_text
      .split('<|assistant|>')[1]?.trim()
      .replace(/```/g, '')
      .replace(/\n\n+/g, '\n\n')
      .trim();

    if (!generatedText) {
      console.error('Aucun texte généré dans la réponse');
      throw new Error('Aucune réponse générée');
    }

    console.log('Réponse générée avec succès:', {
      length: generatedText.length,
      preview: generatedText.substring(0, 100)
    });

    return generatedText;
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Hugging Face:', error);
    throw error;
  }
}