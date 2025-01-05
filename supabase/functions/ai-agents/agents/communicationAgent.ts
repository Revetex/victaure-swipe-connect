export class CommunicationAgent {
  constructor() {}

  async handleMessage(userId: string, message: string) {
    try {
      const response = await this.generateResponse(message);
      await this.saveInteraction(userId, message, response);
      return { response };
    } catch (error) {
      console.error('Error in CommunicationAgent:', error);
      throw error;
    }
  }

  private async generateResponse(message: string) {
    const HUGGING_FACE_API_KEY = Deno.env.get('HUGGING_FACE_API_KEY');
    if (!HUGGING_FACE_API_KEY) {
      throw new Error('HUGGING_FACE_API_KEY is not set');
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: `Tu es M. Victaure, un assistant virtuel spécialisé en placement et recherche d'emploi au Québec. 
          Tu dois répondre en français québécois de manière naturelle et authentique.
          Tu peux aider avec:
          - La recherche d'emploi
          - La création et modification de profil
          - Le remplissage de formulaires
          - Des conseils sur le marché du travail au Québec
          
          Message de l'utilisateur: ${message}
          
          Ta réponse:`,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la génération de la réponse');
    }

    const data = await response.json();
    return data[0].generated_text.trim();
  }

  private async saveInteraction(userId: string, message: string, response: string) {
    // Implement if needed
    console.log('Interaction saved:', { userId, message, response });
  }
}