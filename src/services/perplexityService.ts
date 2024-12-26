let apiKey = '';

export const setApiKey = (key: string) => {
  apiKey = key;
};

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

export async function generateAIResponse(message: string) {
  // Simulation d'un délai de réponse pour plus de naturel
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Sélection aléatoire d'une réponse
  const randomIndex = Math.floor(Math.random() * predefinedResponses.length);
  return predefinedResponses[randomIndex];
}