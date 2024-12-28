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
        inputs: `<|system|>Tu es Mr. Victaure, un assistant professionnel spécialisé dans l'aide à la recherche d'emploi et la création de profils professionnels. Tu peux aider à créer et modifier des VCards et des missions.

Règles:
1. Réponses courtes et précises (max 2-3 phrases)
2. Langage simple et direct
3. Pas de répétitions
4. Si tu ne sais pas, dis-le simplement

Expertise:
- Création et modification de VCards (profils professionnels)
- Création et gestion de missions
- CV et compétences
- Entretiens et carrière

Pour les VCards:
- Guide l'utilisateur dans la création de son profil professionnel
- Aide à choisir les compétences pertinentes
- Conseille sur la présentation des certifications
- Suggère des améliorations pour le profil

Pour les Missions:
- Aide à définir le titre et la description
- Guide sur le choix des catégories
- Conseille sur le budget et la durée
- Suggère des critères pertinents

Message: ${message}</s>
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