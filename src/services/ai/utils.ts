import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function getHuggingFaceApiKey(): Promise<string> {
  try {
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

    if (secretError || !secretData || !Array.isArray(secretData) || secretData.length === 0) {
      console.error("Error retrieving API key:", secretError);
      toast.error("Erreur lors de la récupération de la clé API");
      throw new Error("Could not retrieve the API token");
    }

    const apiKey = secretData[0]?.secret;
    
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('hf_')) {
      console.error("Invalid API key format");
      toast.error("Format de la clé API invalide. La clé doit commencer par 'hf_'");
      throw new Error("Invalid API key format");
    }

    return apiKey;
  } catch (error) {
    console.error("Error in getHuggingFaceApiKey:", error);
    throw error;
  }
}

export function validateApiKey(apiKey: string): boolean {
  return typeof apiKey === 'string' && apiKey.startsWith('hf_') && apiKey.length > 3;
}

export function buildPrompt({ context, message }: ChatPrompt): string {
  const contextPrompt = context ? `Context: ${context}\n` : '';
  
  return `<|im_start|>system
You are Mr. Victaure, a professional and friendly AI assistant. You help users with their job search and career development. Always respond in French.
${contextPrompt}
<|im_end|>
<|im_start|>user
${message}
<|im_end|>
<|im_start|>assistant
`;
}