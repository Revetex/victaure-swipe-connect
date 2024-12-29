import type { UserProfile } from "@/types/profile";

export function getFallbackResponse(profile?: UserProfile): string {
  if (!profile) {
    return "Je suis là pour vous aider à développer votre profil professionnel. Par quoi souhaitez-vous commencer ?";
  }

  const responses = [
    // Réponses personnalisées basées sur le profil
    profile.full_name && !profile.bio
      ? `${profile.full_name}, je peux vous aider à créer une bio professionnelle qui mettra en valeur votre expertise. Voulez-vous commencer par là ?`
      : null,
    
    profile.role && !profile.skills?.length
      ? `En tant que ${profile.role}, quelles sont vos principales compétences ? Je peux vous aider à les mettre en avant de manière stratégique.`
      : null,
    
    profile.skills?.length && !profile.certifications?.length
      ? "Avez-vous des certifications ou formations qui pourraient renforcer votre profil professionnel ?"
      : null,
    
    profile.bio && profile.skills?.length
      ? `Votre profil montre déjà de belles forces. Souhaitez-vous que nous travaillions sur son optimisation pour le rendre encore plus attractif ?`
      : null,

    // Réponses générales mais constructives
    "Je suis là pour vous aider à développer votre présence professionnelle. Sur quel aspect souhaitez-vous travailler en priorité ?",
    
    "Analysons ensemble votre profil pour identifier les opportunités d'amélioration. Que souhaitez-vous mettre en avant ?",
    
    `Comment puis-je vous aider à atteindre vos objectifs professionnels aujourd'hui${profile.full_name ? `, ${profile.full_name}` : ''} ?`
  ].filter(Boolean);

  // Sélectionner une réponse pertinente
  return responses[Math.floor(Math.random() * responses.length)] || 
    "Comment puis-je vous aider à optimiser votre profil professionnel aujourd'hui ?";
}