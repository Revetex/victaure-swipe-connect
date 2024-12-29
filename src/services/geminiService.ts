import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function getApiKey() {
  try {
    console.log('Fetching Gemini API key from Supabase...');
    
    const { data, error } = await supabase.rpc('get_secret', {
      secret_name: 'GEMINI_API_KEY'
    });

    console.log('API key response:', { hasData: !!data, secret: data?.secret });

    if (error) {
      console.error('Error fetching API key:', error);
      toast.error("Erreur lors de la récupération de la clé API", {
        description: error.message,
      });
      throw new Error(`Failed to fetch Gemini API key: ${error.message}`);
    }

    if (!data?.secret) {
      toast.error("La clé API Gemini n'est pas configurée", {
        description: "Veuillez vérifier que la clé existe dans les paramètres Supabase",
        action: {
          label: "Vérifier",
          onClick: () => window.open("https://supabase.com/dashboard/project/mfjllillnpleasclqabb/settings/secrets", "_blank")
        }
      });
      throw new Error('Empty Gemini API key');
    }

    const apiKey = data.secret.trim();
    console.log('API key retrieved:', { hasKey: !!apiKey, keyLength: apiKey?.length });

    if (!apiKey) {
      toast.error("La clé API Gemini est vide", {
        description: "La clé existe mais semble être vide, veuillez la reconfigurer",
        action: {
          label: "Configurer",
          onClick: () => window.open("https://supabase.com/dashboard/project/mfjllillnpleasclqabb/settings/secrets", "_blank")
        }
      });
      throw new Error('Empty Gemini API key');
    }

    return apiKey;
  } catch (error) {
    console.error('Error in getApiKey:', error);
    throw error;
  }
}

export async function generateAIResponse(prompt: string) {
  try {
    const apiKey = await getApiKey();
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}