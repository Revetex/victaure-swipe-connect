import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";

async function getApiKey() {
  try {
    console.log('Fetching Gemini API key from Supabase...');
    
    const { data, error } = await supabase.rpc('get_secret', {
      secret_name: 'GEMINI_API_KEY'
    });

    console.log('API key response:', { hasData: !!data });

    if (error) {
      console.error('Error fetching API key:', error);
      toast.error("Erreur lors de la récupération de la clé API", {
        description: error.message,
      });
      throw new Error(`Failed to fetch Gemini API key: ${error.message}`);
    }

    if (!data) {
      toast.error("La clé API Gemini n'est pas configurée", {
        description: "Veuillez vérifier que la clé existe dans les paramètres Supabase",
        action: {
          label: "Vérifier",
          onClick: () => window.open("https://supabase.com/dashboard/project/mfjllillnpleasclqabb/settings/secrets", "_blank")
        }
      });
      throw new Error('Empty Gemini API key');
    }

    // The secret is returned as a string directly from the RPC function
    const apiKey = String(data).trim();
    console.log('API key retrieved:', { hasKey: !!apiKey, keyLength: apiKey?.length });

    // Validate API key format (Gemini API keys are typically longer than 20 characters)
    if (!apiKey || apiKey.length < 20) {
      toast.error("La clé API Gemini semble invalide", {
        description: "Veuillez vérifier le format de la clé API dans les paramètres",
        action: {
          label: "Configurer",
          onClick: () => window.open("https://makersuite.google.com/app/apikey", "_blank")
        }
      });
      throw new Error('Invalid Gemini API key format');
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
    
    // Check if it's an API key related error
    if (error.message?.includes('API key not valid') || error.message?.includes('Invalid Gemini API key')) {
      toast.error("Erreur d'authentification Gemini", {
        description: "Veuillez vérifier votre clé API Gemini",
        action: {
          label: "Configurer",
          onClick: () => window.open("https://makersuite.google.com/app/apikey", "_blank")
        }
      });
    }
    
    throw error;
  }
}