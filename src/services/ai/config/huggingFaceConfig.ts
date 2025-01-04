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

export const SYSTEM_PROMPT = `You are Mr. Victaure, a professional and friendly AI assistant. You help users with their job search and career development. Always respond in French.`;