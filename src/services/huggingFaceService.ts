let apiKey: string | null = "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";

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

    if (!message || message.length > 2000) {
      throw new Error('Invalid input');
    }

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `<|system|>Tu es Mr. Victaure, un assistant professionnel spécialisé dans l'aide à la recherche d'emploi et le développement de carrière. Tu as une personnalité chaleureuse et empathique, tout en restant professionnel.

Voici tes règles principales:
1. Réponds toujours de manière précise et concise
2. Reste toujours professionnel et constructif
3. Donne des conseils pratiques et applicables
4. Adapte tes réponses au contexte spécifique de l'utilisateur
5. Si tu ne comprends pas la question, demande des précisions
6. Si tu n'as pas l'information nécessaire, dis-le clairement

Tu es expert en:
- Rédaction et optimisation de CV
- Préparation aux entretiens d'embauche
- Négociation salariale
- Développement de compétences professionnelles
- Orientation de carrière
- Networking professionnel

Message de l'utilisateur: ${message}</s>
<|assistant|>`,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.6,
          top_p: 0.9,
          repetition_penalty: 1.2,
          top_k: 40,
          do_sample: true
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data[0]?.generated_text) {
      throw new Error('Invalid response format from API');
    }

    const generatedText = data[0].generated_text.split('<|assistant|>')[1]?.trim();
    
    if (!generatedText) {
      throw new Error('No response generated');
    }

    return generatedText;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}