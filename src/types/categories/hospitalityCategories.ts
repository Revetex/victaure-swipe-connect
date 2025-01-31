import { List, ListCheck, ListPlus } from "lucide-react";
import { CategoryConfig } from "./categoryTypes";

export const hospitalityCategories: Record<string, CategoryConfig> = {
  "Hôtellerie": {
    icon: List,
    subcategories: [
      "Réception",
      "Conciergerie",
      "Gestion hôtelière",
      "Service d'étage",
      "Maintenance"
    ]
  },
  "Restauration": {
    icon: ListCheck,
    subcategories: [
      "Cuisine",
      "Service en salle",
      "Gestion de restaurant",
      "Traiteur",
      "Bar"
    ]
  },
  "Événementiel": {
    icon: ListPlus,
    subcategories: [
      "Organisation d'événements",
      "Coordination de mariages",
      "Gestion de conférences",
      "Animation",
      "Logistique événementielle"
    ]
  }
};