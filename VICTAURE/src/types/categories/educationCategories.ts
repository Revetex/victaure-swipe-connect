import { List, ListCheck } from "lucide-react";
import { CategoryConfig } from "./categoryTypes";

export const educationCategories: Record<string, CategoryConfig> = {
  "Formation Professionnelle": {
    icon: List,
    subcategories: [
      "Formation continue",
      "Formation en entreprise",
      "E-learning",
      "Coaching professionnel",
      "Développement des compétences"
    ]
  },
  "Enseignement": {
    icon: ListCheck,
    subcategories: [
      "Soutien scolaire",
      "Cours particuliers",
      "Formation linguistique",
      "Préparation aux examens",
      "Tutorat"
    ]
  }
};