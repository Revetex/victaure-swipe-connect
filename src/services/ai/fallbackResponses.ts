import type { UserProfile } from "@/types/profile";

export function getFallbackResponse(profile?: UserProfile): string {
  const contextualResponses = [
    profile?.full_name 
      ? `Je peux vous aider à optimiser votre profil professionnel ${profile.full_name}. Voici les aspects prioritaires à améliorer:\n\n` +
        `${!profile.bio ? '- Développer une bio professionnelle qui met en valeur votre expertise\n' : ''}` +
        `${!profile.skills?.length ? '- Ajouter vos compétences clés et technologies maîtrisées\n' : ''}` +
        `${!profile.phone ? '- Compléter vos coordonnées professionnelles\n' : ''}` +
        `${!profile.certifications?.length ? '- Valoriser vos certifications et formations\n' : ''}`
      : "Je peux vous accompagner dans la création de votre profil professionnel. Par où souhaitez-vous commencer ?",
    
    profile?.role
      ? `En tant que ${profile.role}, je peux vous proposer des améliorations ciblées pour votre secteur d'activité.`
      : "Commençons par définir votre rôle professionnel pour personnaliser votre profil.",
    
    "Je peux analyser votre profil et suggérer des améliorations stratégiques.",
    "Souhaitez-vous que nous examinions ensemble votre profil pour le rendre plus attractif ?",
    "Je peux vous aider à mettre en valeur votre parcours et vos compétences de manière optimale.",
  ];
  
  return contextualResponses[Math.floor(Math.random() * contextualResponses.length)];
}