import { ChatError } from "./errorHandler";

export function validateApiKey(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('hf_')) {
    throw new ChatError("Clé API invalide", "INVALID_API_KEY");
  }
  return true;
}

export function validateApiResponse(response: Response): void {
  if (!response.ok) {
    if (response.status === 503) {
      throw new ChatError("Le modèle est en cours de chargement, veuillez réessayer", "MODEL_LOADING");
    }
    if (response.status === 401) {
      throw new ChatError("Clé API non valide", "INVALID_API_KEY");
    }
    throw new ChatError("Erreur lors de la génération de la réponse", "API_ERROR");
  }
}