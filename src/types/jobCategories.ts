import { LucideIcon, Code, Palette, TrendingUp, ClipboardList, Headphones, Building2, Brain, Briefcase, Cog, Database, Globe2, HeartPulse, Laptop, School, Wrench, Hammer, Camera, Leaf, Music, Book, Coffee, Utensils } from "lucide-react";

interface CategoryConfig {
  icon: LucideIcon;
  subcategories: string[];
}

export const missionCategories: Record<string, CategoryConfig> = {
  "Agriculture": {
    icon: Leaf,
    subcategories: [
      "Agriculture biologique",
      "Élevage",
      "Horticulture",
      "Maraîchage",
      "Viticulture"
    ]
  },
  "Artisanat": {
    icon: Hammer,
    subcategories: [
      "Bijouterie",
      "Céramique",
      "Ébénisterie",
      "Maroquinerie",
      "Textile",
      "Verrerie"
    ]
  },
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
  "Hôtellerie & Restauration": {
    icon: Utensils,
    subcategories: [
      "Bar",
      "Cuisine",
      "Management",
      "Réception",
      "Service"
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
  "Médias": {
    icon: Camera,
    subcategories: [
      "Audio",
      "Journalisme",
      "Photo",
      "Production",
      "Vidéo"
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
  }
};

export type ValidCategory = keyof typeof missionCategories;

export const isValidCategory = (category: string): category is ValidCategory => {
  return category in missionCategories;
};