
import { Newspaper, UserCircle, MessageSquare, Settings, Wrench } from "lucide-react";

export const navigationItems = [
  { id: 1, icon: UserCircle, name: "Profil", path: "/dashboard" },
  { id: 2, icon: MessageSquare, name: "Messages", path: "/messages" },
  { id: 3, icon: Newspaper, name: "Actualités", path: "/feed" },
  { id: 4, icon: Wrench, name: "Outils", path: "/tools" },
  { id: 5, icon: Settings, name: "Paramètres", path: "/settings" }
] as const;

export const getPageTitle = (currentPage: number): string => {
  switch (currentPage) {
    case 1:
      return "Tableau de bord";
    case 2:
      return "Messages";
    case 3:
      return "Fil d'actualité";
    case 4:
      return "Outils";
    case 5:
      return "Paramètres";
    default:
      return "Tableau de bord";
  }
};

