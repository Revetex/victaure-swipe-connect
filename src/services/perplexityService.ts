import { pipeline } from '@huggingface/transformers';

let model: any = null;

const initModel = async () => {
  if (!model) {
    try {
      model = await pipeline(
        'text-generation',
        'onnx-community/gpt2-french',
        { 
          device: 'cpu'
        }
      );
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du modèle:', error);
      return null;
    }
  }
  return model;
};

export async function generateAIResponse(message: string) {
  try {
    const modelInstance = await initModel();
    if (!modelInstance) {
      return "Je suis désolé, je ne peux pas répondre pour le moment. Essayez de recharger la page.";
    }

    const result = await modelInstance(message, {
      max_length: 100,
      temperature: 0.7,
      do_sample: true,
      top_k: 50,
      top_p: 0.95,
      no_repeat_ngram_size: 2
    });

    return result[0].generated_text || "Je suis désolé, je n'ai pas compris. Pouvez-vous reformuler ?";
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);
    return "Une erreur est survenue. Veuillez réessayer.";
  }
}