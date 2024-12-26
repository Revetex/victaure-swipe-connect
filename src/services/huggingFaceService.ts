let apiKey: string | null = null;

export const setApiKey = (key: string) => {
  apiKey = key;
};

export async function generateAIResponse(message: string) {
  try {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: message,
        wait_for_model: true
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0].generated_text;
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    
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