
import { UserCircle, MessageSquare, BriefcaseIcon, Newspaper, Users } from "lucide-react";

export const navigationItems = [
  { id: 1, icon: UserCircle, name: "Profil" },
  { id: 2, icon: MessageSquare, name: "Messages" },
  { id: 3, icon: BriefcaseIcon, name: "Missions" },
  { id: 4, icon: Newspaper, name: "Actualités" },
  { id: 11, icon: Users, name: "Amis" }
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
    case 11:
      return "Mes amis";
    default:
      return "Tableau de bord";
  }
};

