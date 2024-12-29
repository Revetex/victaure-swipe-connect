import { supabase } from "@/integrations/supabase/client";

async function getApiKey() {
  try {
    const { data, error } = await supabase.rpc('get_secret', {
      secret_name: 'PERPLEXITY_API_KEY'
    });

    if (error) {
      console.error('Error fetching Perplexity API key:', error);
      throw new Error(`Failed to fetch Perplexity API key: ${error.message}`);
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('No data returned from get_secret');
      throw new Error('Perplexity API key not found in secrets');
    }

    const apiKey = data[0]?.secret?.trim();
    if (!apiKey) {
      console.error('API key is empty or invalid');
      throw new Error('Invalid Perplexity API key format');
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
    console.log('Successfully retrieved Perplexity API key');

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant professionnel qui aide les utilisateurs dans leur recherche d\'emploi. Sois précis et concis dans tes réponses.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    
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