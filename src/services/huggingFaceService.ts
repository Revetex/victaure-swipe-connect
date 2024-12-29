let apiKey: string | null = "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";

const getApiKey = () => {
  if (!apiKey) return null;
  return apiKey;
};

export const setApiKey = (key: string) => {
  apiKey = key;
};

export async function generateAIResponse(message: string, profile?: any) {
  try {
    const key = getApiKey();
    if (!key) {
      throw new Error('API key not configured');
    }

    if (!message || message.length > 2000) {
      throw new Error('Invalid input');
    }

    const systemPrompt = `<|system|>Tu es Mr. Victaure, un assistant professionnel proactif, empathique et bienveillant qui aide les utilisateurs à développer leur carrière. Tu as accès à leur profil et peux les guider de manière personnalisée.

Directives de personnalité:
1. Sois proactif - anticipe les besoins et propose des suggestions concrètes
2. Sois empathique - montre que tu comprends leurs défis professionnels
3. Sois encourageant - félicite les progrès et motive à continuer
4. Sois structuré - organise tes réponses par points clés
5. Sois concis - va droit au but tout en restant chaleureux
6. Sois pratique - donne des exemples concrets et des étapes actionables

Contexte professionnel de l'utilisateur:
${profile ? JSON.stringify({
  nom: profile.full_name,
  role: profile.role,
  compétences: profile.skills,
  ville: profile.city,
  bio: profile.bio
}, null, 2) : 'Pas encore de profil'}

Historique de la conversation:
- Dernier message de l'utilisateur: ${message}

Réponds de manière naturelle et personnalisée en te basant sur leur profil.</s>
<|assistant|>`;

    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: systemPrompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.9,
          repetition_penalty: 1.2,
          top_k: 50,
          do_sample: true,
          return_full_text: false
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

    const generatedText = data[0].generated_text
      .split('<|assistant|>')[1]?.trim()
      .replace(/```/g, '') // Remove code blocks
      .replace(/\n\n+/g, '\n\n') // Normalize line breaks
      .trim();
    
    if (!generatedText) {
      throw new Error('No response generated');
    }

    return generatedText;
  } catch (error) {
    console.error('Error generating response:', error);
    
    // Fallback responses based on context
    const contextualResponses = [
      profile?.full_name 
        ? `Je suis là pour vous aider ${profile.full_name}. Que puis-je faire pour votre développement professionnel ?`
        : "Je suis là pour vous aider dans votre développement professionnel. Que puis-je faire pour vous ?",
      profile?.role
        ? `En tant que ${profile.role}, je peux vous donner des conseils spécifiques à votre domaine.`
        : "Je peux vous aider à définir votre orientation professionnelle.",
      "Je peux vous aider à mettre en valeur vos compétences et expériences.",
      "Voulez-vous des conseils pour développer votre réseau professionnel ?",
      "Je peux vous aider à préparer vos entretiens ou négociations.",
      "Parlons de vos objectifs de carrière et comment les atteindre.",
    ];
    
    return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
  }
}