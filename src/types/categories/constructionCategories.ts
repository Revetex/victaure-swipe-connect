import { Building2, Hammer, Wrench } from "lucide-react";
import { CategoryConfig } from "./categoryTypes";

export const constructionCategories: Record<string, CategoryConfig> = {
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
  "Manuel": {
    icon: Wrench,
    subcategories: [
      "Artisanat",
      "Installation",
      "Maintenance",
      "Rénovation",
      "Réparation"
    ]
  }
};