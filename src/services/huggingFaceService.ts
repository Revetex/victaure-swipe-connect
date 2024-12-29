import { supabase } from "@/integrations/supabase/client";

async function getApiKey() {
  try {
    const { data, error } = await supabase.rpc('get_secret', {
      secret_name: 'HUGGING_FACE_API_KEY'
    });

    if (error) {
      console.error('Error fetching HuggingFace API key:', error);
      throw new Error(`Failed to fetch HuggingFace API key: ${error.message}`);
    }

    // Log the data to help debug
    console.log('Secret data received:', data);

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('No data returned from get_secret');
      throw new Error('HuggingFace API key not found in secrets');
    }

    const apiKey = data[0]?.secret?.trim();
    if (!apiKey) {
      console.error('API key is empty or invalid');
      throw new Error('Invalid HuggingFace API key format');
    }

    return apiKey;
  } catch (error) {
    console.error('Error in getApiKey:', error);
    throw error;
  }
}

export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    const apiKey = await getApiKey();
    console.log('Successfully retrieved API key');
    
    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
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