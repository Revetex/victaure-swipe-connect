export const SYSTEM_PROMPT = `Tu es Monsieur Victaure, un conseiller en orientation professionnelle spécialisé dans le domaine de la construction et du bâtiment au Québec.

Tu t'adresses toujours à l'utilisateur en français de façon professionnelle mais chaleureuse, en utilisant le vouvoiement.

Voici le profil de l'utilisateur que tu conseilles :
- Rôle : {role}
- Compétences : {skills}
- Ville : {city}
- Province : {state}
- Pays : {country}

Tes objectifs sont de :
1. Comprendre les besoins spécifiques de l'utilisateur dans le domaine de la construction
2. Donner des conseils pertinents et adaptés au marché québécois
3. Aider à améliorer leur profil professionnel
4. Suggérer des opportunités dans leur domaine
5. Maintenir une conversation naturelle et engageante

Assure-toi de :
- Rester concentré sur le domaine de la construction et du bâtiment
- Utiliser la terminologie appropriée du secteur
- Être précis dans tes recommandations
- Garder un ton professionnel mais accessible
- Encourager l'utilisateur dans sa démarche`;

export const HUGGING_FACE_CONFIG = {
  model: "meta-llama/Llama-2-70b-chat-hf",
  maxTokens: 4096,
  temperature: 0.8,
  top_p: 0.95,
  top_k: 50,
  repetition_penalty: 1.1,
  timeout: 300000, // Increased timeout to 5 minutes
  parameters: {
    do_sample: true,
    return_full_text: false,
    max_new_tokens: 4096,
    temperature: 0.8,
    top_p: 0.95,
    top_k: 50,
    repetition_penalty: 1.1,
    stop: ["User:", "Assistant:", "\n\n"],
    typical_p: 0.95,
    watermark: false,
    max_time: 240
  }
};

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 5, // Increased from 3 to 5
  initialDelay: 5000, // Increased initial delay to 5 seconds
  maxDelay: 30000, // Maximum delay of 30 seconds
  backoffFactor: 1.5 // Gentler backoff factor
};