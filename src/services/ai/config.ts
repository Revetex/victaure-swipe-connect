export const API_CONFIG = {
  endpoint: "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
  defaultHeaders: {
    "Content-Type": "application/json",
  },
  modelParams: {
    max_new_tokens: 250,
    temperature: 0.7,
    top_p: 0.95,
    repetition_penalty: 1.2,
  }
};