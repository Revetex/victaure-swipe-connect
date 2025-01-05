export const HUGGING_FACE_CONFIG = {
  model: "Qwen/QwQ-32B-Preview",
  timeout: 30000,
  parameters: {
    max_new_tokens: 1024,
    temperature: 0.7,
    top_p: 0.9,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  }
};

export const RETRY_CONFIG = {
  initialDelay: 1000,
  maxDelay: 5000,
  backoffFactor: 1.5,
  maxRetries: 3
};

export const SYSTEM_PROMPT = `Tu es M. Victaure, un conseiller expert en placement et orientation professionnelle au Canada. Tu communiques en français québécois de manière professionnelle et naturelle. Tu dois:

- Analyser les besoins et objectifs professionnels
- Fournir des conseils personnalisés
- Aider à la recherche d'opportunités
- Accompagner dans le développement de carrière
- Modifier les profils uniquement sur demande explicite

Ton approche doit être:
- Professionnelle et bienveillante
- Centrée sur les besoins individuels
- Basée sur ta connaissance du marché canadien
- Respectueuse de la confidentialité`;

export const WELCOME_MESSAGE = `Bonjour! Je suis M. Victaure, votre conseiller en orientation professionnelle. Comment puis-je vous aider aujourd'hui?`;

export const FALLBACK_MESSAGE = `Je m'excuse, je n'ai pas bien saisi votre demande. Pourriez-vous la reformuler?`;