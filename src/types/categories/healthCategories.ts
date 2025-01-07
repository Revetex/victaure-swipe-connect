import { List, ListCheck } from "lucide-react";
import { CategoryConfig } from "./categoryTypes";

export const healthCategories: Record<string, CategoryConfig> = {
  "Santé et Bien-être": {
    icon: List,
    subcategories: [
      "Coaching santé",
      "Nutrition",
      "Fitness",
      "Médecine alternative",
      "Thérapie"
    ]
  },
  "Services Médicaux": {
    icon: ListCheck,
    subcategories: [
      "Soins infirmiers",
      "Assistance médicale",
      "Télémédecine",
      "Services paramédicaux",
      "Pharmacie"
    ]
  }
};