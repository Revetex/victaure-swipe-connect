
import { UserCircle, MessageSquare, BriefcaseIcon, Newspaper, Calculator, Languages, ListTodo, StickyNote, Sword, Settings2 } from "lucide-react";

export const navigationItems = [
  { id: 1, icon: UserCircle, name: "Profil" },
  { id: 2, icon: MessageSquare, name: "Messages" },
  { id: 3, icon: BriefcaseIcon, name: "Missions" },
  { id: 4, icon: Newspaper, name: "Actualités" },
  { id: 5, icon: Calculator, name: "Calculatrice" },
  { id: 6, icon: Languages, name: "Traducteur" },
  { id: 7, icon: StickyNote, name: "Notes" },
  { id: 8, icon: ListTodo, name: "Tâches" },
  { id: 9, icon: Sword, name: "Échecs" },
  { id: 10, icon: Settings2, name: "Paramètres" }
] as const;

export const getPageTitle = (currentPage: number): string => {
  switch (currentPage) {
    case 1:
      return "Tableau de bord";
    case 2:
      return "Messages";
    case 3:
      return "Marketplace";
    case 4:
      return "Fil d'actualité";
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
