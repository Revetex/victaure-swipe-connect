import { Code, Palette, TrendingUp, ClipboardList, Headphones, MoreHorizontal, Building2, Brain, Briefcase, Cog, Database, Globe2, HeartPulse, Laptop, School, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
  // Virtual fields for display
  company?: string;
  salary?: string;
  skills?: string[];
}

export type ValidCategory = keyof typeof missionCategories;

export const isValidCategory = (category: string): category is ValidCategory => {
  return category in missionCategories;
};

interface CategoryConfig {
  icon: LucideIcon;
  subcategories: string[];
}

export const missionCategories: Record<string, CategoryConfig> = {
  "Construction": {
    icon: Building2,
    subcategories: [
      "Architecture",
      "BIM",
      "Finitions",
      "Gros œuvre",
      "Second œuvre"
    ]
  },
  "Design": {
    icon: Palette,
    subcategories: [
      "3D",
      "Branding",
      "Graphisme",
      "Illustration",
      "Motion Design",
      "UI/UX",
      "Web Design"
    ]
  },
  "Développement": {
    icon: Code,
    subcategories: [
      "Architecture",
      "Backend",
      "Base de données",
      "DevOps",
      "Frontend",
      "Full Stack",
      "Mobile",
      "Sécurité",
      "Tests et QA"
    ]
  },
  "Éducation": {
    icon: School,
    subcategories: [
      "E-learning",
      "EdTech",
      "Formation",
      "Pédagogie",
      "Tutorat"
    ]
  },
  "Expertise": {
    icon: Brain,
    subcategories: [
      "Audit",
      "Certification",
      "Conseil",
      "Expertise technique",
      "Formation"
    ]
  },
  "Finance": {
    icon: Briefcase,
    subcategories: [
      "Audit",
      "Comptabilité",
      "Contrôle de gestion",
      "Risk Management",
      "Trésorerie"
    ]
  },
  "Gestion de projet": {
    icon: ClipboardList,
    subcategories: [
      "Agile",
      "PMO",
      "Product Owner",
      "Scrum",
      "Waterfall"
    ]
  },
  "Logistique": {
    icon: Globe2,
    subcategories: [
      "Achats",
      "Planning",
      "Stock",
      "Supply Chain",
      "Transport"
    ]
  },
  "Manuel": {
    icon: Wrench,
    subcategories: [
      "Artisanat",
      "Installation",
      "Maintenance",
      "Rénovation",
      "Réparation"
    ]
  },
  "Marketing": {
    icon: TrendingUp,
    subcategories: [
      "Analytics",
      "Content Marketing",
      "Email Marketing",
      "Growth Hacking",
      "SEO",
      "SEM",
      "Social Media"
    ]
  },
  "Production": {
    icon: Cog,
    subcategories: [
      "Industrie",
      "Maintenance",
      "Méthodes",
      "Qualité",
      "R&D"
    ]
  },
  "Recherche": {
    icon: Database,
    subcategories: [
      "Études",
      "Innovation",
      "Laboratoire",
      "R&D",
      "Veille"
    ]
  },
  "Ressources Humaines": {
    icon: HeartPulse,
    subcategories: [
      "Formation",
      "Paie",
      "Recrutement",
      "Relations sociales",
      "SIRH"
    ]
  },
  "Santé": {
    icon: HeartPulse,
    subcategories: [
      "Bien-être",
      "E-santé",
      "Médical",
      "Paramédical",
      "Recherche"
    ]
  },
  "Support": {
    icon: Headphones,
    subcategories: [
      "Documentation",
      "Formation",
      "Support client",
      "Support technique"
    ]
  },
  "Technologie": {
    icon: Laptop,
    subcategories: [
      "Blockchain",
      "Cloud",
      "Data",
      "DevOps",
      "IA",
      "Mobile",
      "Sécurité"
    ]
  },
  "Vente": {
    icon: TrendingUp,
    subcategories: [
      "Account Management",
      "B2B",
      "B2C",
      "Business Development",
      "Export"
    ]
  }
};