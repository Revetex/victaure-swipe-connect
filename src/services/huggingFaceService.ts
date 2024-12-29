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

    // Get the Hugging Face access token from Supabase
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_ACCESS_TOKEN' });
    
    if (secretError) {
      console.error('Error fetching secret:', secretError);
      throw new Error('Impossible de récupérer le token d\'accès');
    }

    // Vérification plus stricte du token
    if (!secretData || !Array.isArray(secretData) || secretData.length === 0) {
      console.error('Secret data is invalid:', secretData);
      throw new Error('Token d\'accès Hugging Face non configuré');
    }

    const token = secretData[0]?.secret;
    if (!token || typeof token !== 'string' || !token.trim()) {
      console.error('Token is invalid:', token);
      throw new Error('Token d\'accès Hugging Face invalide');
    }

    console.log('Making request to Hugging Face API with token...');

    const systemPrompt = `<|system|>Tu es Mr. Victaure, un assistant professionnel et amical qui aide les utilisateurs avec leurs questions. Tu réponds toujours en français de manière concise et claire.

<|user|>${message}

<|assistant|>`;

    const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
      headers: {
        'Authorization': `Bearer ${token.trim()}`,
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
      const errorData = await response.json();
      console.error('Hugging Face API error:', errorData);
      throw new Error(`Erreur API: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    if (!Array.isArray(data) || !data[0]?.generated_text) {
      console.error('Invalid response format:', data);
      throw new Error('Format de réponse invalide');
    }

    const generatedText = data[0].generated_text.trim();
    
    if (!generatedText) {
      throw new Error('Aucune réponse générée');
    }

    return generatedText;

  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);
    throw error;
  }
}