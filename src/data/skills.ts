export const skillCategories: Record<string, string[]> = {
  "Construction": [
    "Maçonnerie",
    "Charpenterie",
    "Plomberie",
    "Électricité",
    "Peinture",
    "Carrelage",
    "Menuiserie",
    "Toiture"
  ],
  "Gestion": [
    "Gestion de projet",
    "Gestion de chantier",
    "Gestion d'équipe",
    "Planification",
    "Budgétisation",
    "Leadership"
  ],
  "Technique": [
    "Lecture de plans",
    "AutoCAD",
    "SketchUp",
    "Revit",
    "BIM",
    "Estimation"
  ],
  "Sécurité": [
    "Sécurité au travail",
    "Premiers soins",
    "SIMDUT",
    "Travail en hauteur",
    "Protection incendie"
  ],
  "Soft Skills": [
    "Communication",
    "Travail d'équipe",
    "Résolution de problèmes",
    "Autonomie",
    "Organisation",
    "Ponctualité"
  ]
};

export const getSkillsByCategory = (category: string): string[] => {
  return skillCategories[category] || [];
};

export const getAllCategories = (): string[] => {
  return Object.keys(skillCategories);
};