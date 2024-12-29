import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";

export async function generateAIResponse(message: string, profile?: UserProfile) {
  try {
    if (!message?.trim()) {
      throw new Error('Message invalide');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const systemPrompt = `<|system|>Tu es Mr. Victaure, un assistant professionnel et amical qui aide les utilisateurs avec leurs questions. Tu réponds toujours en français de manière concise et claire.

<|user|>${message}

<|assistant|>`;

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!Array.isArray(data) || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }

    const generatedText = data[0].generated_text.trim();
    
    if (!generatedText) {
      throw new Error('Aucune réponse générée');
    }

    return generatedText;

  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);
    return "Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.";
  }
}