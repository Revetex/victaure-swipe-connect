import type { UserProfile } from "@/types/profile";

export function getFallbackResponse(profile?: UserProfile): string {
  if (!profile) {
    return "Je suis là pour vous aider à créer un profil professionnel attractif. Par où souhaitez-vous commencer ?";
  }

  const responses = [
    // Réponses personnalisées basées sur le profil
    profile.full_name && !profile.bio
      ? `${profile.full_name}, je peux vous aider à développer une bio professionnelle qui mettra en valeur votre expertise. Souhaitez-vous que nous commencions par là ?`
      : null,
    
    profile.role && !profile.skills?.length
      ? `En tant que ${profile.role}, quelles sont vos principales compétences techniques et soft skills ? Je peux vous aider à les mettre en avant.`
      : null,
    
    profile.skills?.length && !profile.certifications?.length
      ? "Avez-vous des certifications ou formations à valoriser qui complèteraient vos compétences actuelles ?"
      : null,
    
    // Réponses générales mais constructives
    "Je peux vous aider à optimiser chaque aspect de votre profil. Sur quelle partie souhaitez-vous travailler en priorité ?",
    
    "Analysons ensemble votre profil pour identifier les opportunités d'amélioration. Que souhaitez-vous mettre en avant ?",
    
    "Je suis là pour vous accompagner dans le développement de votre présence professionnelle. Quel est votre objectif principal ?"
  ].filter(Boolean);

  // Sélectionner une réponse aléatoire parmi celles qui sont pertinentes
  return responses[Math.floor(Math.random() * responses.length)] || 
    "Comment puis-je vous aider à optimiser votre profil professionnel aujourd'hui ?";
}