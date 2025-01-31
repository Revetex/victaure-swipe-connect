export interface Skill {
  name: string;
  category: string;
}

export const skillCategories = [
  "Construction",
  "Gestion",
  "Sécurité",
  "Technique",
  "Communication",
  "Informatique",
  "Autre"
] as const;

export const skills: Skill[] = [
  // Construction
  { name: "Maçonnerie", category: "Construction" },
  { name: "Charpenterie", category: "Construction" },
  { name: "Plomberie", category: "Construction" },
  { name: "Électricité", category: "Construction" },
  { name: "Peinture", category: "Construction" },
  
  // Gestion
  { name: "Gestion de projet", category: "Gestion" },
  { name: "Gestion de chantier", category: "Gestion" },
  { name: "Planification", category: "Gestion" },
  { name: "Leadership", category: "Gestion" },
  { name: "Organisation", category: "Gestion" },
  
  // Sécurité
  { name: "Sécurité du travail", category: "Sécurité" },
  { name: "Premiers soins", category: "Sécurité" },
  { name: "Prévention des risques", category: "Sécurité" },
  
  // Technique
  { name: "Lecture de plans", category: "Technique" },
  { name: "AutoCAD", category: "Technique" },
  { name: "Estimation", category: "Technique" },
  
  // Communication
  { name: "Communication", category: "Communication" },
  { name: "Service client", category: "Communication" },
  { name: "Négociation", category: "Communication" },
  
  // Informatique
  { name: "Suite Office", category: "Informatique" },
  { name: "Logiciels de gestion", category: "Informatique" },
  
  // Autres compétences générales
  { name: "Résolution de problèmes", category: "Autre" },
  { name: "Travail d'équipe", category: "Autre" },
  { name: "Autonomie", category: "Autre" }
];

export const getSkillsByCategory = (category: string) => {
  return skills.filter(skill => skill.category === category);
};

export const getAllCategories = () => {
  return skillCategories;
};

export const isValidCategory = (category: string): category is typeof skillCategories[number] => {
  return skillCategories.includes(category as typeof skillCategories[number]);
};