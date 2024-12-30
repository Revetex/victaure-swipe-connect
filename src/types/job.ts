import { Code, Briefcase, PaintBucket, HardHat, Wrench, Brain } from "lucide-react";

export interface Job {
  id: string;
  title: string;
  company?: string;
  location: string;
  salary?: string;
  category: string;
  contract_type: string;
  experience_level: string;
  skills?: string[];
  budget?: number;
  description?: string;
  employer_id?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  subcategory?: string;
  duration?: string;
  images?: string[];
  required_skills?: string[];
  preferred_skills?: string[];
}

export const missionCategories: Record<string, { icon: any; subcategories: string[] }> = {
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
};

// Add a type for valid categories to ensure type safety
export type ValidCategory = keyof typeof missionCategories;

// Helper function to check if a category is valid
export const isValidCategory = (category: string): category is ValidCategory => {
  return category in missionCategories;
};