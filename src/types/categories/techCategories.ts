import { Code, Database, Globe2, Laptop } from "lucide-react";
import { CategoryConfig } from "./categoryTypes";

export const techCategories: Record<string, CategoryConfig> = {
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
  "Support": {
    icon: Globe2,
    subcategories: [
      "Documentation",
      "Formation",
      "Support client",
      "Support technique"
    ]
  }
};