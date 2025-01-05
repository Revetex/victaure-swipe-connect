import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function getHuggingFaceApiKey(): Promise<string> {
  try {
    console.log('Récupération de la clé API Hugging Face...');
    const { data, error } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'HUGGING_FACE_API_KEY' }
    });

    if (error) {
      console.error('Erreur lors de la récupération de la clé API:', error);
      throw new Error('Erreur lors de la récupération de la clé API');
    }

    const apiKey = data?.secret;
    if (!apiKey) {
      console.error('Clé API non trouvée');
      throw new Error('Clé API non trouvée');
    }

    console.log('Clé API récupérée avec succès');
    return apiKey;
  } catch (error) {
    console.error('Erreur dans getHuggingFaceApiKey:', error);
    throw error;
  }
}

export async function generateAIResponse(message: string, systemPrompt: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    console.log('Génération de la réponse IA...');
    const apiKey = await getHuggingFaceApiKey();
    
    console.log('Envoi de la requête à l\'API Hugging Face...');
    
    const response = await fetch(
      `https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false,
            wait_for_model: true
          }
        }),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erreur API Hugging Face:', errorData);
      
      if (response.status === 503) {
        throw new Error('Le modèle est en cours de chargement, veuillez patienter quelques secondes et réessayer.');
      }
      throw new Error(errorData.error || 'Erreur lors de la génération de la réponse');
    }

    const data = await response.json();
    console.log('Réponse reçue de l\'API:', data);
    
    if (!data || !data[0]?.generated_text) {
      throw new Error('Format de réponse invalide');
    }
    
    return data[0].generated_text.trim();
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse IA:', error);
    if (error.name === 'AbortError') {
      throw new Error('La requête a pris trop de temps. Veuillez réessayer.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}