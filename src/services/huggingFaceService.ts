let apiKey: string | null = null;

// Fonction pour masquer la clé API dans la console
const getApiKey = () => {
  if (!apiKey) return null;
  return apiKey;
};

export const setApiKey = (key: string) => {
  apiKey = key;
};

export async function generateAIResponse(message: string) {
  try {
    const key = getApiKey();
    if (!key) {
      throw new Error('API key not configured');
    }

    // Ajout de vérifications de sécurité
    if (!message || message.length > 1000) {
      throw new Error('Invalid input');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `<|system|>Tu es un assistant professionnel qui aide les utilisateurs dans leur recherche d'emploi. Sois précis et concis dans tes réponses.</s>
<|user|>${message}</s>
<|assistant|>`,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.15
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0].generated_text.split('<|assistant|>')[1].trim();
  } catch (error) {
    console.error('Une erreur est survenue:', error instanceof Error ? error.message : 'Erreur inconnue');
    
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