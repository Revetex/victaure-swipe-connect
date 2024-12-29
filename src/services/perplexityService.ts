let apiKey: string | null = null;

export const setApiKey = (key: string) => {
  apiKey = key;
};

export async function generateAIResponse(message: string) {
  try {
    if (!apiKey) {
      throw new Error('API key not configured');
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
    throw error;
  }
}