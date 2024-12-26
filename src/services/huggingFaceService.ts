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
      "Je suis votre assistant professionnel Victaure. Comment puis-je vous aider dans votre recherche d'emploi aujourd'hui ?",
      "Je peux vous aider à optimiser votre CV pour maximiser vos chances d'être remarqué par les recruteurs.",
      "Souhaitez-vous des conseils pour préparer vos entretiens d'embauche ? Je peux vous donner des techniques éprouvées.",
      "Je peux vous aider à identifier et mettre en valeur vos compétences clés pour votre secteur d'activité.",
      "Avez-vous des questions sur la négociation salariale ? Je peux vous conseiller sur les meilleures pratiques.",
      "Je peux vous aider à rédiger une lettre de motivation percutante qui se démarque.",
      "Parlons de votre projet professionnel. Quels sont vos objectifs à court et moyen terme ?",
      "Je peux vous donner des conseils pour développer votre présence professionnelle sur LinkedIn et autres réseaux.",
    ];
    return predefinedResponses[Math.floor(Math.random() * predefinedResponses.length)];
  }
}