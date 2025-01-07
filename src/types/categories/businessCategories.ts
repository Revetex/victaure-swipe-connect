import { Briefcase, Brain, ClipboardList, HeartPulse, TrendingUp } from "lucide-react";
import { CategoryConfig } from "./categoryTypes";

export const businessCategories: Record<string, CategoryConfig> = {
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
  "Ressources Humaines": {
    icon: HeartPulse,
    subcategories: [
      "Formation",
      "Paie",
      "Recrutement",
      "Relations sociales",
      "SIRH"
    ]
  }
};