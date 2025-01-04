import { toast } from "sonner";

export async function handleApiResponse(response: Response): Promise<string> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Hugging Face API Error Response:", errorText);
    
    if (response.status === 503) {
      toast.error("Le modèle est en cours de chargement, veuillez réessayer dans quelques instants");
      throw new Error("Model is loading");
    } else if (response.status === 401) {
      toast.error("La clé API n'est pas valide");
      throw new Error("Invalid API key");
    }
    
    toast.error("Erreur lors de la génération de la réponse");
    throw new Error(`API request failed: ${errorText}`);
  }

  const result = await response.json();
  console.log("API Response:", result);

  if (Array.isArray(result) && result.length > 0 && result[0]?.generated_text) {
    return result[0].generated_text.trim();
  } 
  
  if (result.generated_text) {
    return result.generated_text.trim();
  }

  console.error("Unexpected API response format:", result);
  toast.error("Format de réponse invalide");
  throw new Error("Invalid response format from API");
}