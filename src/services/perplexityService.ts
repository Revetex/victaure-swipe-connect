const predefinedResponses = [
  "Je peux vous aider à trouver des missions intéressantes au Canada.",
  "Je vous suggère de mettre à jour votre profil pour augmenter vos chances de trouver des missions.",
  "Je peux vous aider à naviguer sur la plateforme et à utiliser toutes ses fonctionnalités.",
  "N'hésitez pas à consulter les nouvelles missions disponibles dans le marketplace.",
  "Je peux vous aider à optimiser votre VCard pour attirer plus d'opportunités.",
  "Avez-vous pensé à mettre en avant vos certifications canadiennes ?",
  "Je peux vous aider à préparer vos entretiens avec les entreprises canadiennes.",
];

export async function generateAIResponse(message: string) {
  // Simulation d'un délai de réponse pour plus de réalisme
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Sélection aléatoire d'une réponse
  const randomIndex = Math.floor(Math.random() * predefinedResponses.length);
  return predefinedResponses[randomIndex];
}