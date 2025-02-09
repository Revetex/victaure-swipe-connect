
import { Calculator, Languages, ListTodo, StickyNote, Sword, Settings2 } from "lucide-react";

export const navigationItems = [
  { id: 5, icon: Calculator, name: "Calculatrice" },
  { id: 6, icon: Languages, name: "Traducteur" },
  { id: 7, icon: StickyNote, name: "Notes" },
  { id: 8, icon: ListTodo, name: "Tâches" },
  { id: 9, icon: Sword, name: "Échecs" },
  { id: 10, icon: Settings2, name: "Paramètres" }
] as const;

export const getPageTitle = (currentPage: number): string => {
  switch (currentPage) {
    case 5:
      return "Calculatrice";
    case 6:
      return "Traducteur";
    case 7:
      return "Notes";
    case 8:
      return "Tâches";
    case 9:
      return "Échecs";
    case 10:
      return "Paramètres";
    default:
      return "Tableau de bord";
  }
};
