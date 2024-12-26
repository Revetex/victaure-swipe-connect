export async function generateAIResponse(message: string, apiKey: string) {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Tu es un assistant professionnel canadien nommé Mr. Victaure. Tu dois répondre de manière précise, utile et bienveillante. Tu dois toujours répondre en français.'
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

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);
    return "Désolé, je rencontre des difficultés techniques. Pouvez-vous reformuler votre question ?";
  }
}