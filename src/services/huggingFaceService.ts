import { supabase } from "@/integrations/supabase/client";
import type { UserProfile } from "@/types/profile";
import { checkRateLimit } from "./ai/rateLimiter";
import { sanitizeInput } from "./ai/inputSanitizer";
import { buildSystemPrompt } from "./ai/promptBuilder";

export async function generateAIResponse(message: string, profile?: UserProfile) {
  if (!message?.trim()) {
    throw new Error('Message invalide');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Utilisateur non authentifié');
  }

  if (!checkRateLimit(user.id)) {
    throw new Error('Limite de requêtes atteinte. Veuillez réessayer dans une minute.');
  }

  const sanitizedMessage = sanitizeInput(message);
  const systemPrompt = buildSystemPrompt(profile, sanitizedMessage);

  console.log('Generating AI response:', {
    messageLength: sanitizedMessage.length,
    hasProfile: !!profile,
    prompt: systemPrompt
  });

  const { data: secretData, error: secretError } = await supabase.rpc('get_secret', {
    secret_name: 'HUGGING_FACE_API_KEY'
  });

  if (secretError || !secretData?.[0]?.secret) {
    console.error('Error fetching API key:', secretError);
    throw new Error('Configuration API manquante');
  }

  const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
    headers: {
      'Authorization': `Bearer ${secretData[0].secret}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      inputs: systemPrompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.15,
        top_k: 50,
        do_sample: true,
        return_full_text: false,
        stop: ["</s>", "<|im_end|>", "<|user|>"]
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorData
    });
    throw new Error(`Erreur API: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Raw API Response:', data);

  if (!Array.isArray(data) || !data[0]?.generated_text) {
    console.error('Invalid response format:', data);
    throw new Error('Format de réponse invalide');
  }

  const generatedText = data[0].generated_text
    .split('<|assistant|>')[1]?.trim()
    .replace(/```/g, '')
    .replace(/\n\n+/g, '\n\n')
    .trim();

  if (!generatedText) {
    console.error('No generated text in response');
    throw new Error('Aucune réponse générée');
  }

  console.log('Final response:', {
    length: generatedText.length,
    preview: generatedText.substring(0, 100)
  });

  return generatedText;
}