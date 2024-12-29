import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

async function getApiKey() {
  try {
    console.log('Fetching Gemini API key from Supabase...');
    
    const { data, error } = await supabase.rpc('get_secret', {
      secret_name: 'GEMINI_API_KEY'
    });

    if (error) {
      console.error('Error fetching Gemini API key:', error);
      toast.error("Erreur lors de la récupération de la clé API Gemini");
      throw new Error(`Failed to fetch Gemini API key: ${error.message}`);
    }

    console.log('API key response:', { hasData: !!data, dataLength: data?.length });

    // Check if we got any data back
    if (!data || data.length === 0) {
      toast.error("La clé API Gemini n'est pas configurée", {
        description: "Veuillez vérifier que la clé existe dans les paramètres Supabase",
        action: {
          label: "Vérifier",
          onClick: () => window.open("https://supabase.com/dashboard/project/mfjllillnpleasclqabb/settings/secrets", "_blank")
        }
      });
      throw new Error('Gemini API key not found in secrets');
    }

    const apiKey = data[0]?.secret?.trim();
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

export async function generateAIResponse(message: string) {
  try {
    const apiKey = await getApiKey();
    console.log('Successfully retrieved Gemini API key');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Tu es un assistant professionnel qui aide les utilisateurs dans leur recherche d'emploi. Sois précis et concis dans tes réponses. Message de l'utilisateur: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      toast.error("Erreur lors de la génération de la réponse");
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error('Unexpected Gemini API response format:', data);
      toast.error("Format de réponse inattendu");
      throw new Error('Unexpected API response format');
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}
