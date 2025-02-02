export const skillCategories: Record<string, string[]> = {
  "Construction": [
    "Maçonnerie",
    "Charpenterie",
    "Plomberie",
    "Électricité",
    "Peinture",
    "Carrelage",
    "Menuiserie",
    "Toiture",
    "Isolation",
    "Démolition",
    "Rénovation",
    "Construction durable",
    "Lecture de plans",
    "Coffrage",
    "Ferraillage",
    "Étanchéité"
  ],
  "Gestion": [
    "Gestion de projet",
    "Gestion de chantier",
    "Gestion d'équipe",
    "Planification",
    "Budgétisation",
    "Leadership",
    "Coordination",
    "Supervision",
    "Estimation",
    "Approvisionnement",
    "Contrôle qualité",
    "Gestion des risques",
    "Gestion des contrats",
    "Négociation"
  ],
  "Technique": [
    "Lecture de plans",
    "AutoCAD",
    "SketchUp",
    "Revit",
    "BIM",
    "Estimation",
    "Topographie",
    "Dessin technique",
    "Modélisation 3D",
    "Calcul de structures",
    "Métrés",
    "Diagnostic technique",
    "Maintenance préventive",
    "Contrôle technique"
  ],
  "Sécurité": [
    "Sécurité au travail",
    "Premiers soins",
    "SIMDUT",
    "Travail en hauteur",
    "Protection incendie",
    "Prévention des risques",
    "Équipements de protection",
    "Gestion des urgences",
    "Conformité SST",
    "Analyse des risques",
    "Formation sécurité",
    "Inspection sécurité"
  ],
  "Soft Skills": [
    "Communication",
    "Travail d'équipe",
    "Résolution de problèmes",
    "Autonomie",
    "Organisation",
    "Ponctualité",
    "Adaptabilité",
    "Gestion du stress",
    "Service client",
    "Leadership",
    "Créativité",
    "Esprit d'initiative",
    "Fiabilité",
    "Polyvalence"
  ],
  "Spécialisations": [
    "Énergie solaire",
    "Domotique",
    "Construction écologique",
    "Rénovation patrimoniale",
    "Smart building",
    "Efficacité énergétique",
    "Construction métallique",
    "Génie climatique",
    "Acoustique",
    "Accessibilité PMR",
    "Construction passive",
    "Restauration"
  ]
};

export const getSkillsByCategory = (category: string): string[] => {
  return skillCategories[category] || [];
};

export const getAllCategories = (): string[] => {
  return Object.keys(skillCategories);
};