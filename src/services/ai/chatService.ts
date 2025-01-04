import { supabase } from "@/integrations/supabase/client";
import { HUGGING_FACE_CONFIG, SYSTEM_PROMPT } from "./config/huggingFaceConfig";
import { validateApiKey, validateApiResponse } from "./utils/apiValidator";
import { handleChatError } from "./utils/errorHandler";
import type { ChatContext, ApiResponse } from "./types/chatTypes";

async function getHuggingFaceApiKey(): Promise<string> {
  const { data: secretData, error } = await supabase
    .rpc('get_secret', { secret_name: 'HUGGING_FACE_API_KEY' });

  if (error || !secretData) {
    throw new Error("Could not retrieve the API token");
  }

  return secretData;
}

async function buildPrompt({ context, message }: ChatContext): Promise<string> {
  const contextPrompt = context 
    ? `Context: User profile - Name: ${context.full_name}, Role: ${context.role}\n` 
    : '';
  
  return `<|im_start|>system\n${SYSTEM_PROMPT}\n${contextPrompt}<|im_end|>\n<|im_start|>user\n${message}\n<|im_end|>\n<|im_start|>assistant\n`;
}

export async function generateAIResponse(message: string, profile?: any): Promise<string> {
  console.log("Generating AI response for message:", message);
  
  try {
    const apiKey = await getHuggingFaceApiKey();
    validateApiKey(apiKey);

    const prompt = await buildPrompt({ context: profile, message });

    console.log("Sending request to Hugging Face API...");
    const response = await fetch(HUGGING_FACE_CONFIG.endpoint, {
      headers: { 
        ...HUGGING_FACE_CONFIG.defaultHeaders,
        Authorization: `Bearer ${apiKey}`
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: HUGGING_FACE_CONFIG.modelParams
      }),
    });

    validateApiResponse(response);

    const result = await response.json() as ApiResponse;
    
    if (!result.generated_text) {
      throw new Error("Invalid response format from API");
    }

    return result.generated_text.trim();
  } catch (error) {
    return handleChatError(error);
  }
}