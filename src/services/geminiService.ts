import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

async function getApiKey() {
  try {
    const { data, error } = await supabase.rpc('get_secret', {
      secret_name: 'HUGGING_FACE_ACCESS_TOKEN'
    });

    if (error) {
      console.error('Error fetching HuggingFace API key:', error);
      toast.error("Erreur lors de la récupération de la clé API", {
        description: error.message,
      });
      throw new Error(`Failed to fetch HuggingFace API key: ${error.message}`);
    }

    if (!data) {
      toast.error("La clé API HuggingFace n'est pas configurée");
      throw new Error('Empty HuggingFace API key');
    }

    const apiKey = String(data).trim();
    
    if (!apiKey || apiKey.length < 20) {
      toast.error("La clé API HuggingFace semble invalide");
      throw new Error('Invalid HuggingFace API key format');
    }

    return apiKey;
  } catch (error) {
    console.error('Error in getApiKey:', error);
    throw error;
  }
}

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const apiKey = await getApiKey();
    
    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `<|system|>Tu es Mr. Victaure, un assistant professionnel et amical qui aide les utilisateurs à gérer leur carrière. Tu es bienveillant et encourageant.</s>
<|user|>${prompt}</s>
<|assistant|>`,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HuggingFace API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (Array.isArray(result) && result.length > 0) {
      const generatedText = result[0]?.generated_text || '';
      return generatedText.trim();
    }

    throw new Error('Invalid response format from API');
  } catch (error) {
    console.error('Error generating AI response:', error);
    toast.error("Erreur lors de la génération de la réponse", {
      description: error.message,
    });
    throw error;
  }
}