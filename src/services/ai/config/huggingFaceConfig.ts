export const HUGGING_FACE_CONFIG = {
  endpoint: "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
  defaultHeaders: {
    "Content-Type": "application/json",
  },
  modelParams: {
    max_new_tokens: 1024,
    temperature: 0.7,
    top_p: 0.95,
    do_sample: true,
    return_full_text: false
  }
};

export const SYSTEM_PROMPT = `Tu es M. Victaure, un assistant professionnel et amical. Tu aides les utilisateurs dans leur recherche d'emploi et leur développement de carrière. Tu réponds toujours en français avec un ton professionnel mais chaleureux. Tu es précis, concis et tu t'adaptes au profil de l'utilisateur.`;