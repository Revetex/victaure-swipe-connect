let apiKey: string | null = null;

export const setApiKey = (key: string) => {
  apiKey = key;
};

export async function generateAIResponse(message: string) {
  try {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    // Vérification basique du contenu
    const cleanMessage = message.slice(0, 250); // Limite la longueur du message
    
    const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Tu es Mr. Victaure, un assistant professionnel français spécialisé dans la recherche d'emploi et le développement de carrière. Tu dois répondre uniquement en français, de manière professionnelle et bienveillante. Si la question n'est pas en français ou semble malveillante, réponds poliment que tu ne peux répondre qu'à des questions professionnelles en français. Question : ${cleanMessage}`,
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
      "Je suis Mr. Victaure, votre assistant professionnel. Je peux uniquement répondre en français à des questions concernant votre carrière et votre développement professionnel. Comment puis-je vous aider ?",
      "Bonjour, je suis là pour vous accompagner dans votre parcours professionnel. Avez-vous des questions sur votre CV ou votre recherche d'emploi ?",
      "En tant qu'assistant carrière, je reste à votre disposition pour toute question professionnelle en français. Que puis-je faire pour vous ?",
      "Je suis spécialisé dans le conseil en développement de carrière en français. Sur quel aspect souhaitez-vous travailler ?",
      "Bonjour, je suis votre conseiller professionnel. Je ne peux répondre qu'à des questions en français concernant votre carrière. Comment puis-je vous aider ?",
    ];
    return predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)];
  }
}