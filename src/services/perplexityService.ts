import { pipeline } from '@huggingface/transformers';

let textGenerator: any = null;

const initializeGenerator = async () => {
  if (!textGenerator) {
    textGenerator = await pipeline('text-generation', 'Geotrend/distilbert-base-fr-cased', {
      revision: 'main'
    });
  }
  return textGenerator;
};

export const setApiKey = (key: string) => {
  // Cette fonction est gardée pour maintenir la compatibilité
  console.log('API key not needed anymore');
};

export async function generateAIResponse(message: string) {
  try {
    const generator = await initializeGenerator();
    const result = await generator(message, {
      max_length: 100,
      num_return_sequences: 1
    });
    return result[0].generated_text;
  } catch (error) {
    console.error('Erreur lors de la génération:', error);
    // Fallback sur des réponses prédéfinies en cas d'erreur
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
    const randomIndex = Math.floor(Math.random() * predefinedResponses.length);
    return predefinedResponses[randomIndex];
  }
}