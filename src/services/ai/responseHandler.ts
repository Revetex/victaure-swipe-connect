import { HuggingFaceResponse, ApiError } from "@/types/ai/chat";
import { toast } from "sonner";

export async function handleApiResponse(response: Response): Promise<string> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Hugging Face API Error Response:", errorText);
    
    try {
      const errorJson = JSON.parse(errorText) as ApiError;
      if (errorJson.error?.includes("token seems invalid")) {
        toast.error("La clé API Hugging Face n'est pas valide. Veuillez vérifier votre clé.");
        throw new Error("Invalid Hugging Face API token");
      }
    } catch (e) {
      if (response.status === 503) {
        toast.error("Le modèle est en cours de chargement, veuillez réessayer dans quelques instants");
        throw new Error("Model is loading");
      } else if (response.status === 401 || response.status === 400) {
        toast.error("La clé API n'est pas valide");
        throw new Error("Invalid API key");
      }
      toast.error("Erreur lors de la génération de la réponse");
      throw new Error(`API request failed: ${errorText}`);
    }
  }

  const responseClone = response.clone();
  
  try {
    const result = await response.json();
    console.log("API Response:", result);

    if (Array.isArray(result) && result.length > 0 && result[0]?.generated_text) {
      return result[0].generated_text.trim();
    } 
    
    if ((result as HuggingFaceResponse).generated_text) {
      return (result as HuggingFaceResponse).generated_text.trim();
    }

    const textResponse = await responseClone.text();
    if (textResponse) {
      return textResponse.trim();
    }

    console.error("Unexpected API response format:", result);
    toast.error("Format de réponse invalide");
    throw new Error("Invalid response format from API");
  } catch (parseError) {
    console.error("Error parsing JSON response:", parseError);
    const textResponse = await responseClone.text();
    if (textResponse) {
      return textResponse.trim();
    }
    throw parseError;
  }
}