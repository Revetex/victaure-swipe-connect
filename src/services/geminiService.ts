import { supabase } from "@/integrations/supabase/client";

async function getApiKey() {
  try {
    const { data, error } = await supabase.rpc('get_secret', {
      secret_name: 'GEMINI_API_KEY'
    });

    if (error) {
      console.error('Error fetching Gemini API key:', error);
      throw new Error(`Failed to fetch Gemini API key: ${error.message}`);
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('No data returned from get_secret');
      throw new Error('Gemini API key not found in secrets');
    }

    const apiKey = data[0]?.secret?.trim();
    if (!apiKey) {
      console.error('API key is empty or invalid');
      throw new Error('Invalid Gemini API key format');
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
            text: `You are a professional assistant helping users with their job search. Be precise and concise in your responses. User message: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.8,
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
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback responses in case of error
    const predefinedResponses = [
      "Je suis là pour vous aider dans votre recherche d'emploi. Que puis-je faire pour vous ?",
      "Je peux vous donner des conseils sur la rédaction de votre CV.",
      "N'hésitez pas à me poser des questions sur les entretiens d'embauche.",
      "Je peux vous aider à identifier vos compétences clés.",
      "Voulez-vous des conseils pour votre recherche d'emploi ?",
      "Je peux vous aider à préparer votre lettre de motivation.",
      "Avez-vous besoin d'aide pour définir votre projet professionnel ?",
      "Je peux vous donner des astuces pour développer votre réseau professionnel.",
    ];
    return predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)];
  }
}