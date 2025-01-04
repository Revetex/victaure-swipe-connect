import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChatPrompt {
  message: string;
  profile?: {
    full_name?: string;
    role?: string;
  };
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

    return secretData as string;
  } catch (error) {
    console.error("Error in getHuggingFaceApiKey:", error);
    throw error;
  }
}

export function buildPrompt({ message, profile }: ChatPrompt): string {
  const profilePrompt = profile ? `User profile - Name: ${profile.full_name}, Role: ${profile.role}\n` : '';
  
  return `<|im_start|>system
You are Mr. Victaure, a professional and friendly AI assistant. You help users with their job search and career development. Always respond in French.
${profilePrompt}
<|im_end|>
<|im_start|>user
${message}
<|im_end|>
<|im_start|>assistant
`;
}