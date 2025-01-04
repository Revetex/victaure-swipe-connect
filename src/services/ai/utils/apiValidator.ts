import { ChatError } from "./errorHandler";

export function validateApiKey(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') {
    throw new ChatError("Clé API manquante", "MISSING_API_KEY");
  }
  return true;
}

export async function validateApiResponse(response: Response): Promise<void> {
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Hugging Face API Error Response:", errorText);

    if (response.status === 503) {
      throw new ChatError("Le modèle est en cours de chargement, veuillez réessayer", "MODEL_LOADING");
    }
    if (response.status === 401) {
      throw new ChatError("Clé API non valide", "INVALID_API_KEY");
    }
    throw new ChatError("Erreur lors de la génération de la réponse", "API_ERROR");
  }
}