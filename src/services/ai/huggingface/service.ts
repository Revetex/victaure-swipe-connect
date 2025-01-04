import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config";
import { AIError, ChatContext, HuggingFaceResponse } from "./types";
import { toast } from "sonner";

export async function getApiKey(): Promise<string> {
  console.log("Fetching Hugging Face API key...");
  const { data, error } = await supabase
    .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

  if (error) {
    console.error("Error retrieving API key:", error);
    throw new AIError("Could not retrieve the API token", "API_KEY_ERROR");
  }

  if (!data?.[0]?.secret) {
    console.error("API key not found in response:", data);
    throw new AIError("API key not found", "API_KEY_MISSING");
  }

  console.log("API key retrieved successfully");
  return data[0].secret;
}

export async function validateApiResponse(response: Response): Promise<void> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);

    if (response.status === 503) {
      throw new AIError("Le modèle est en cours de chargement, veuillez réessayer dans quelques instants", "MODEL_LOADING");
    }
    if (response.status === 401) {
      throw new AIError("La clé API n'est pas valide", "INVALID_API_KEY");
    }
    
    throw new AIError("Erreur lors de la génération de la réponse", "API_ERROR");
  }
}

export async function generateResponse({ message, profile }: ChatContext): Promise<string> {
  try {
    console.log("Starting AI response generation...");
    const apiKey = await getApiKey();

    const prompt = `<|im_start|>system
${SYSTEM_PROMPT}
${profile ? `Profil utilisateur - Nom: ${profile.full_name}, Rôle: ${profile.role}\n` : ''}
<|im_end|>
<|im_start|>user
${message}
<|im_end|>
<|im_start|>assistant
`;

    console.log("Sending request to API...");
    const response = await fetch(HUGGING_FACE_CONFIG.endpoint, {
      method: "POST",
      headers: { 
        ...HUGGING_FACE_CONFIG.defaultHeaders,
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: HUGGING_FACE_CONFIG.modelParams
      }),
    });

    console.log("Response status:", response.status);
    await validateApiResponse(response);

    const result = await response.json();
    console.log("Raw API Response:", result);
    
    if (Array.isArray(result) && result.length > 0 && result[0]?.generated_text) {
      return result[0].generated_text.trim();
    } 
    
    if (result.generated_text) {
      return result.generated_text.trim();
    }

    console.error("Unexpected API response format:", result);
    throw new AIError("Format de réponse invalide", "INVALID_FORMAT");
  } catch (error) {
    console.error("Error generating response:", error);
    if (error instanceof AIError) {
      toast.error(error.message);
    } else {
      toast.error("Une erreur est survenue lors de la communication avec l'assistant");
    }
    throw error;
  }
}