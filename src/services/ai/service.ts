import { supabase } from "@/integrations/supabase/client";

export async function getHuggingFaceApiKey(): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('get_secret', {
      secret_name: 'HUGGING_FACE_API_KEY'
    });

    if (error) {
      throw error;
    }

    // Since the RPC returns a single row with a 'secret' column
    if (!data || typeof data !== 'string') {
      throw new Error('API key not found');
    }

    return data;
  } catch (error) {
    console.error('Error fetching Hugging Face API key:', error);
    throw error;
  }
}
