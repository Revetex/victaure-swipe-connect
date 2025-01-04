import { ChatError } from "./errorHandler";

export function validateApiKey(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') {
    console.error("API key validation failed");
    throw new ChatError("Clé API manquante ou invalide", "INVALID_API_KEY");
  }
  return true;
}

export async function validateApiResponse(response: Response): Promise<void> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Hugging Face API Error Response:", errorText);

    if (response.status === 503) {
      throw new ChatError("Le modèle est en cours de chargement, veuillez réessayer dans quelques instants", "MODEL_LOADING");
    }
    if (response.status === 401) {
      throw new ChatError("La clé API n'est pas valide", "INVALID_API_KEY");
    }
    
    throw new ChatError("Erreur lors de la génération de la réponse", "API_ERROR");
  }
}