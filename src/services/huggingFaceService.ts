let apiKey: string | null = null;

export const setApiKey = (key: string) => {
  apiKey = key;
};

export async function generateAIResponse(message: string) {
  try {
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `Tu es un assistant professionnel spécialisé dans la recherche d'emploi et le développement de carrière. Réponds de manière professionnelle et pertinente à cette question : ${message}`,
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
      "Je suis votre assistant professionnel spécialisé dans la recherche d'emploi. Je reste concentré sur votre carrière et votre développement professionnel. Comment puis-je vous aider ?",
      "En tant qu'assistant professionnel, je me concentre sur votre carrière. Souhaitez-vous des conseils sur votre CV, votre recherche d'emploi ou vos entretiens ?",
      "Je suis là pour vous accompagner dans votre parcours professionnel. Que puis-je faire pour vous aider à atteindre vos objectifs de carrière ?",
      "Mon rôle est de vous assister dans votre développement professionnel. Parlons de vos ambitions et de la façon dont je peux vous aider à les réaliser.",
      "En tant qu'assistant carrière, je peux vous conseiller sur votre stratégie de recherche d'emploi. Sur quel aspect souhaitez-vous travailler ?",
      "Je suis spécialisé dans le conseil en développement de carrière. Comment puis-je vous aider à progresser professionnellement aujourd'hui ?",
      "Mon expertise porte sur l'accompagnement professionnel. Que puis-je faire pour vous aider dans votre parcours de carrière ?",
      "Je suis votre conseiller en développement professionnel. Concentrons-nous sur vos objectifs de carrière. Que souhaitez-vous améliorer ?",
    ];
    return predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)];
  }
}