import { LucideIcon } from "lucide-react";

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  employer_id: string;
  status: 'open' | 'closed' | 'in-progress';
  category: string;
  contract_type: string;
  experience_level: string;
  subcategory?: string;
  duration?: string;
  images?: string[];
  required_skills?: string[];
  preferred_skills?: string[];
  latitude?: number;
  longitude?: number;
  remote_type?: string;
  application_deadline?: string;
  created_at?: string;
  updated_at?: string;
}

export const missionCategories: Record<string, { icon: LucideIcon; subcategories: string[] }> = {
  "Développement": {
    icon: "Code",
    subcategories: [
      "Frontend",
      "Backend",
      "Full Stack",
      "Mobile",
      "DevOps",
      "Base de données",
      "Tests et QA",
      "Sécurité",
      "Architecture",
      "Autre"
    ]
  },
  "Design": {
    icon: "Palette",
    subcategories: [
      "UI/UX",
      "Web Design",
      "Graphisme",
      "Motion Design",
      "3D",
      "Illustration",
      "Branding",
      "Autre"
    ]
  },
  "Marketing": {
    icon: "TrendingUp",
    subcategories: [
      "SEO",
      "SEM",
      "Social Media",
      "Content Marketing",
      "Email Marketing",
      "Growth Hacking",
      "Analytics",
      "Autre"
    ]
  },
  "Gestion de projet": {
    icon: "ClipboardList",
    subcategories: [
      "Agile",
      "Scrum",
      "Waterfall",
      "PMO",
      "Product Owner",
      "Autre"
    ]
  },
  "Support": {
    icon: "Headphones",
    subcategories: [
      "Support technique",
      "Support client",
      "Formation",
      "Documentation",
      "Autre"
    ]
  },
  "Autre": {
    icon: "MoreHorizontal",
    subcategories: [
      "Conseil",
      "Stratégie",
      "Innovation",
      "Recherche",
      "Autre"
    ]
  }
};