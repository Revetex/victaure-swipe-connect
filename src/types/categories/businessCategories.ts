import { Briefcase, Building2, TrendingUp, Globe2, Headphones } from "lucide-react";
import type { CategoryConfig } from "./categoryTypes";

export const businessCategories: Record<string, CategoryConfig> = {
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
    icon: Building2,
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
  "Support": {
    icon: Headphones,
    subcategories: [
      "Documentation",
      "Formation",
      "Support client",
      "Support technique"
    ]
  }
};