
export const WELCOME_MESSAGE = `Bonjour! Je suis M. Victaure, votre conseiller spécialisé dans le domaine de la construction au Québec.

Je suis là pour vous guider dans votre parcours professionnel. Pour mieux vous aider, j'aimerais en apprendre davantage sur vous.

Pourriez-vous me parler un peu de :
- Votre expérience professionnelle actuelle
- Vos compétences principales
- Vos objectifs de carrière

Cela me permettra de vous proposer des opportunités pertinentes et de vous conseiller au mieux.`;

export const FALLBACK_MESSAGE = `Je m'excuse, mais je n'ai pas bien saisi votre message. Pour mieux vous aider, pourriez-vous reformuler ou me parler de :
- Votre situation professionnelle actuelle
- Vos objectifs de carrière
- Vos compétences que vous souhaitez mettre en avant`;

export const PROACTIVE_QUESTIONS = [
  "Quels types de projets vous passionnent le plus dans la construction?",
  "Avez-vous des certifications particulières dans votre domaine?",
  "Dans quelle région du Québec préférez-vous travailler?",
  "Quel type d'environnement de travail vous motive le plus?",
  "Quelles sont vos attentes en termes de salaire?",
  "Êtes-vous plutôt intéressé par des postes permanents ou des contrats?",
  "Y a-t-il des compétences spécifiques que vous souhaitez développer?",
  "Quelle est votre expérience avec les nouvelles technologies de construction?",
  "Préférez-vous travailler sur des petits ou grands chantiers?",
  "Avez-vous de l'expérience en gestion d'équipe?"
];

export const LEARNING_PROMPTS = {
  SKILLS_IDENTIFIED: "J'ai noté que vous avez de l'expérience en {skills}. Y a-t-il d'autres compétences que vous souhaitez mentionner?",
  LOCATION_PREFERENCE: "Je vois que vous êtes basé(e) à {location}. Seriez-vous ouvert(e) à des opportunités dans d'autres régions?",
  CAREER_GOALS: "D'après ce que je comprends, vous visez {goal}. Comment puis-je vous aider à atteindre cet objectif?",
  SALARY_RANGE: "Pour les postes de {role}, le salaire moyen se situe entre {min} et {max}. Est-ce que cela correspond à vos attentes?",
  EXPERIENCE_LEVEL: "Avec votre niveau d'expérience en {domain}, je peux vous proposer des postes de {suggested_roles}. Cela vous intéresse-t-il?"
};

export const CUSTOM_ADVICE = {
  CERTIFICATION: "Compte tenu de votre profil, je vous recommande la certification {cert_name}. Elle pourrait augmenter vos opportunités de {percentage}%.",
  SKILL_GAP: "J'ai remarqué que la compétence {skill} est très demandée dans votre domaine. Souhaitez-vous que je vous suggère des ressources pour l'acquérir?",
  MARKET_TREND: "Le secteur {sector} est en pleine croissance au Québec. Avec vos compétences en {skills}, vous pourriez y trouver d'excellentes opportunités.",
  SALARY_NEGOTIATION: "Pour un poste de {role} avec votre expérience, vous pourriez négocier un salaire entre {min} et {max}. Voulez-vous des conseils pour la négociation?"
};
