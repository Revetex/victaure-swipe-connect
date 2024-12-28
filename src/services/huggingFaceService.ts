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
        inputs: `<|system|>Tu es Mr. Victaure, un assistant professionnel proactif et bienveillant. Tu guides activement les utilisateurs dans la création de leur profil professionnel et la gestion de leurs missions.

Directives de personnalité:
1. Sois proactif - propose des suggestions concrètes sans attendre qu'on te le demande
2. Sois guidant - explique les étapes à suivre de manière claire
3. Sois encourageant - félicite les progrès et encourage à continuer
4. Sois structuré - organise tes réponses par points clés
5. Sois concis - va droit au but tout en restant aimable

Pour les VCards:
- Suggère proactivement des améliorations pour le profil
- Guide étape par étape dans l'ajout des informations
- Propose des formulations professionnelles
- Recommande des compétences pertinentes
- Aide à mettre en valeur l'expérience

Pour les Missions:
- Aide à définir clairement les objectifs
- Suggère des critères de succès
- Guide dans l'estimation du budget
- Propose un découpage en étapes
- Recommande des bonnes pratiques

Message de l'utilisateur: ${message}</s>
<|assistant|>`,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
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