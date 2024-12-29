import { supabase } from "@/integrations/supabase/client";

let apiKey: string | null = null;

const getApiKey = async () => {
  if (!apiKey) {
    try {
      console.log('Fetching Hugging Face API key...');
      const { data, error } = await supabase.functions.invoke('get-secret', {
        body: { secretName: 'HUGGING_FACE_ACCESS_TOKEN' }
      });
      
      if (error) {
        console.error('Error invoking get-secret function:', error);
        throw new Error(`Failed to get Hugging Face API key: ${error.message}`);
      }
      
      if (!data?.secret) {
        console.error('No API key returned from get-secret function');
        throw new Error('Hugging Face API key not found in response');
      }
      
      console.log('Successfully retrieved API key');
      apiKey = data.secret;
    } catch (error) {
      console.error('Error in getApiKey:', error);
      throw error;
    }
  }
  return apiKey;
};

export const setApiKey = (key: string) => {
  apiKey = key;
};

export async function generateAIResponse(message: string, profile?: any) {
  try {
    const key = await getApiKey();
    if (!key) {
      throw new Error('Hugging Face API key not configured');
    }

    if (!message || message.length > 2000) {
      throw new Error('Invalid input');
    }

    const systemPrompt = `<|system|>Tu es Mr. Victaure, un assistant IA amical et professionnel. Tu aides les utilisateurs avec leurs questions et besoins.

Message de l'utilisateur: ${message}</s>
<|assistant|>`;

    console.log('Calling Hugging Face API...');
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.2,
          top_k: 40,
          do_sample: true
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Hugging Face API error:', errorData);
      throw new Error(`API request failed: ${errorData.error || response.statusText}`);
    }

    const data = await response.json();
    console.log('Received response from Hugging Face API');
    
    if (!data[0]?.generated_text) {
      throw new Error('Invalid response format from API');
    }

    const generatedText = data[0].generated_text.split('<|assistant|>')[1]?.trim();
    
    if (!generatedText) {
      throw new Error('No response generated');
    }

    return generatedText;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}