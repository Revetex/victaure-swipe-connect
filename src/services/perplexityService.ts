let apiKey = '';

export const setApiKey = (key: string) => {
  apiKey = key;
};

export async function generateAIResponse(message: string) {
  try {
    if (!apiKey) {
      return "Veuillez configurer votre clé API Perplexity pour continuer.";
    }

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
            content: 'Tu es un assistant professionnel et amical qui aide les utilisateurs dans leur recherche d\'emploi. Réponds toujours en français de manière concise et pertinente.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erreur API Perplexity:', error);
      return "Désolé, une erreur est survenue. Veuillez réessayer.";
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);
    return "Une erreur est survenue. Veuillez réessayer.";
  }
}