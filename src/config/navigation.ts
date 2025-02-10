
import { UserCircle, MessageSquare, BriefcaseIcon, ListTodo, Bell, UserPlus, UserSearch, LayoutDashboard, Newspaper } from "lucide-react";

export const navigationItems = [
  // Section principale
  { id: 1, icon: LayoutDashboard, name: "Tableau de bord" },
  { id: 2, icon: MessageSquare, name: "Messages" },
  { id: 3, icon: BriefcaseIcon, name: "Emplois" },
  { id: 4, icon: Newspaper, name: "Actualité" },
  
  // Section réseau
  { id: 9, icon: Bell, name: "Notifications" },
  { id: 12, icon: UserPlus, name: "Demandes" },
  { id: 13, icon: UserSearch, name: "Rechercher" }
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
    case 9:
      return "Notifications";
    case 12:
      return "Demandes d'amis";
    case 13:
      return "Rechercher des profils";
    default:
      return "Tableau de bord";
  }
};
