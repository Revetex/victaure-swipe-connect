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
}

export interface JobFilters {
  category: string;
  subcategory: string;
  duration: string;
  experienceLevel: string;
  location: string;
  searchTerm: string;
}

export const missionCategories: Record<string, { icon: any; subcategories: string[] }> = {
  "Technologie": {
    icon: Code,
    subcategories: ["Développement Web", "DevOps", "Mobile", "Data", "Cloud", "Sécurité", "IA", "Blockchain"]
  },
  "Gestion": {
    icon: Briefcase,
    subcategories: ["Product Management", "Agile", "Conseil", "Stratégie", "Opérations", "Qualité"]
  },
  "Design": {
    icon: PaintBucket,
    subcategories: ["UI/UX", "Graphisme", "Motion", "3D", "Web Design", "Print", "Branding"]
  },
  "Construction": {
    icon: HardHat,
    subcategories: ["Gros œuvre", "Second œuvre", "Finitions", "BIM", "Architecture"]
  },
  "Manuel": {
    icon: Wrench,
    subcategories: ["Rénovation", "Installation", "Maintenance", "Artisanat", "Réparation"]
  },
  "Expertise": {
    icon: Brain,
    subcategories: ["Formation", "Audit", "Conseil", "Expertise technique", "Certification"]
  }
};

export type ValidCategory = keyof typeof missionCategories;

export const isValidCategory = (category: string): category is ValidCategory => {
  return category in missionCategories;
};