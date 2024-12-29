import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";
import { checkRateLimit } from "./ai/rateLimiter";
import { sanitizeInput } from "./ai/inputSanitizer";

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

    console.log('Récupération de la clé API...');
    const { data: secretData, error: secretError } = await supabase.rpc('get_secret', {
      secret_name: 'HUGGING_FACE_API_KEY'
    });

    if (secretError) {
      console.error('Erreur lors de la récupération de la clé API:', secretError);
      throw new Error('Erreur de configuration API');
    }

    const apiKey = secretData?.[0]?.secret?.trim();
    if (!apiKey) {
      console.error('Clé API non trouvée ou vide');
      throw new Error('Clé API Hugging Face non configurée. Veuillez configurer la clé API dans les paramètres.');
    }

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
      const errorText = await response.text();
      console.error('Erreur API Hugging Face:', errorText);
      
      // Check for specific error cases
      if (response.status === 429) {
        throw new Error('Trop de requêtes. Veuillez patienter quelques secondes avant de réessayer.');
      } else if (response.status === 503) {
        throw new Error('Le modèle est en cours de chargement. Veuillez réessayer dans quelques secondes.');
      }
      
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    const responseData = await response.json() as HuggingFaceResponse[];
    console.log('Réponse reçue:', responseData);

    if (!Array.isArray(responseData) || !responseData[0]?.generated_text) {
      console.error('Réponse invalide:', responseData);
      throw new Error('Format de réponse invalide');
    }

    const generatedText = responseData[0].generated_text
      .split('<|assistant|>')[1]?.trim()
      .replace(/```/g, '')
      .replace(/\n\n+/g, '\n\n')
      .trim();
    
    if (!generatedText) {
      console.error('Réponse vide générée');
      throw new Error('Aucune réponse générée');
    }

    console.log('Texte généré avec succès:', generatedText.substring(0, 100) + '...');
    return generatedText;

  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Une erreur inattendue est survenue');
  }
}