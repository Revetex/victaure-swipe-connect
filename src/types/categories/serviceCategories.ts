import { List, ListCheck, ListPlus } from "lucide-react";
import { CategoryConfig } from "./categoryTypes";

export const serviceCategories: Record<string, CategoryConfig> = {
  "Services Administratifs": {
    icon: List,
    subcategories: [
      "Secrétariat",
      "Gestion administrative",
      "Assistance virtuelle",
      "Saisie de données",
      "Archivage"
    ]
  },
  "Services Juridiques": {
    icon: ListCheck,
    subcategories: [
      "Conseil juridique",
      "Rédaction de contrats",
      "Propriété intellectuelle",
      "Droit des affaires",
      "Droit du travail"
    ]
  },
  "Services Financiers": {
    icon: ListPlus,
    subcategories: [
      "Comptabilité",
      "Fiscalité",
      "Audit",
      "Conseil financier",
      "Gestion de patrimoine"
    ]
  }
};