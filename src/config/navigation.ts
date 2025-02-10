
import { UserCircle, MessageSquare, BriefcaseIcon, Newspaper, Cog, ListTodo, Calculator, Bell, UserPlus, UserSearch } from "lucide-react";

export const navigationItems = [
  { id: 1, icon: UserCircle, name: "Profil" },
  { id: 2, icon: MessageSquare, name: "Messages" },
  { id: 3, icon: BriefcaseIcon, name: "Emplois" },
  { id: 4, icon: Newspaper, name: "Actualités" },
  { id: 7, icon: ListTodo, name: "Tâches" },
  { id: 8, icon: Calculator, name: "Calculatrice" },
  { id: 9, icon: Bell, name: "Notifications" },
  { id: 10, icon: Cog, name: "Paramètres" },
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
      return "Actualités";
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
    default:
      return "Tableau de bord";
  }
};
