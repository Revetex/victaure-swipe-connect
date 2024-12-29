import type { UserProfile } from "@/types/profile";

const defaultResponses = [
  "Je suis là pour vous aider dans votre recherche d'emploi.",
  "N'hésitez pas à me poser des questions sur votre profil professionnel.",
  "Je peux vous aider à optimiser votre CV et votre présence en ligne.",
  "Comment puis-je vous aider aujourd'hui ?",
  "Je suis spécialisé dans le conseil en développement de carrière.",
  "Avez-vous des questions sur la recherche d'emploi ?",
];

export async function generateAIResponse(message: string, profile?: UserProfile) {
  console.log('Message reçu:', message);
  console.log('Profil utilisateur:', profile);

  // Sélectionner une réponse aléatoire
  const randomIndex = Math.floor(Math.random() * defaultResponses.length);
  return defaultResponses[randomIndex];
}