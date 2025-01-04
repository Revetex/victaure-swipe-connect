import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatPrompt {
  context?: string;
  message: string;
}

export async function getHuggingFaceApiKey(): Promise<string> {
  try {
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

    if (secretError || !secretData) {
      console.error("Error retrieving API key:", secretError);
      toast.error("Erreur lors de la récupération de la clé API");
      throw new Error("Could not retrieve the API token");
    }

    return secretData.secret;
  } catch (error) {
    console.error("Error in getHuggingFaceApiKey:", error);
    throw error;
  }
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