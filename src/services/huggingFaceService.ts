import { supabase } from "@/integrations/supabase/client";

const MODEL_URL = "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta";

async function getApiKey() {
  try {
    const { data, error } = await supabase.rpc('get_secret', {
      secret_name: 'HUGGING_FACE_API_KEY'
    });

    if (error) {
      console.error('Supabase get_secret error:', error);
      throw new Error(`Failed to fetch HuggingFace API key: ${error.message}`);
    }

    if (!data || !Array.isArray(data) || data.length === 0 || !data[0]?.secret?.trim()) {
      console.error('No valid API key found in Supabase secrets');
      throw new Error('Please add your HuggingFace API key in Supabase secrets');
    }

    return data[0].secret;
  } catch (error) {
    console.error('Error in getApiKey:', error);
    throw error;
  }
}

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const apiKey = await getApiKey();
    
    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `<|system|>You are a helpful assistant.</s>
<|user|>${prompt}</s>
<|assistant|>`,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HuggingFace API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (Array.isArray(result) && result.length > 0) {
      const generatedText = result[0]?.generated_text || '';
      return generatedText.trim();
    }

    throw new Error('Invalid response format from API');
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}