export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  category: string;
  contract_type: string;
  experience_level: string;
  skills: string[];
}

export const missionCategories = {
  "Technologie": {
    icon: Code,
    subcategories: ["Développement Web", "DevOps", "Mobile", "Data"]
  },
  "Gestion": {
    icon: Briefcase,
    subcategories: ["Product Management", "Agile", "Conseil"]
  },
  "Design": {
    icon: PaintBucket,
    subcategories: ["UI/UX", "Graphisme", "Motion"]
  },
  "Construction": {
    icon: HardHat,
    subcategories: ["Gros œuvre", "Second œuvre", "Finitions"]
  },
  "Manuel": {
    icon: Wrench,
    subcategories: ["Rénovation", "Installation", "Maintenance"]
  },
  "Expertise": {
    icon: Brain,
    subcategories: ["Formation", "Audit", "Conseil"]
  }
} as const;