import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const response = await fetch("https://api-inference.huggingface.co/models/facebook/opt-125m", {
      method: 'POST',
      headers: {
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
      description: "Le service est temporairement indisponible. Veuillez réessayer plus tard.",
    });
    throw error;
  }
}