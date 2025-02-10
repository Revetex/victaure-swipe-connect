
import { UserCircle, MessageSquare, BriefcaseIcon, ListTodo, Bell, UserPlus, UserSearch, Calculator, Languages, Settings, LayoutDashboard, Newspaper, ChessKnight, StickyNote } from "lucide-react";

export const navigationItems = [
  // Section principale
  { id: 1, icon: LayoutDashboard, name: "Tableau de bord" },
  { id: 2, icon: MessageSquare, name: "Messages" },
  { id: 3, icon: BriefcaseIcon, name: "Emplois" },
  { id: 4, icon: Newspaper, name: "Actualité" },
  
  // Section réseau
  { id: 9, icon: Bell, name: "Notifications" },
  { id: 12, icon: UserPlus, name: "Demandes" },
  { id: 13, icon: UserSearch, name: "Rechercher" },
  
  // Outils
  { id: 7, icon: ListTodo, name: "Tâches" },
  { id: 8, icon: Calculator, name: "Calculatrice" },
  { id: 14, icon: Languages, name: "Traducteur" },
  { id: 15, icon: ChessKnight, name: "Échecs" },
  { id: 16, icon: StickyNote, name: "Notes" },
  { id: 10, icon: Settings, name: "Paramètres" }
] as const;

export const getPageTitle = (currentPage: number): string => {
  switch (currentPage) {
    case 1:
      return "Tableau de bord";
    case 2:
      return "Messages";
    case 3:
      return "Emplois";
    case 4:
      return "Actualité";
    case 7:
      return "Tâches";
    case 8:
      return "Calculatrice";
    case 9:
      return "Notifications";
    case 10:
      return "Paramètres";
    case 12:
      return "Demandes d'amis";
    case 13:
      return "Rechercher des profils";
    case 14:
      return "Traducteur";
    case 15:
      return "Échecs";
    case 16:
      return "Notes";
    default:
      return "Tableau de bord";
  }
};
