import { supabase } from "@/integrations/supabase/client";

export async function getHuggingFaceApiKey(): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'HUGGING_FACE_API_KEY' }
    });

    if (error) throw new Error('Erreur lors de la récupération de la clé API');
    if (!data?.secret) throw new Error('Clé API non trouvée');

    return data.secret;
  } catch (error) {
    console.error('Erreur dans getHuggingFaceApiKey:', error);
    throw error;
  }
}

export async function callHuggingFaceAPI(
  apiKey: string,
  message: string,
  systemPrompt: string,
  config: any,
  controller: AbortController
) {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${config.model}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`,
        parameters: config.parameters
      }),
      signal: controller.signal
    }
  );

  console.log(`Statut de la réponse: ${response.status}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erreur lors de la génération de la réponse');
  }

  const data = await response.json();
  
  if (!data?.[0]?.generated_text) {
    throw new Error('Format de réponse invalide');
  }

  return data[0].generated_text.trim();
}