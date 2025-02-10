
import { UserCircle, MessageSquare, BriefcaseIcon, Newspaper, Users, UserPlus, UserSearch } from "lucide-react";

export const navigationItems = [
  { id: 1, icon: UserCircle, name: "Profil" },
  { id: 2, icon: MessageSquare, name: "Messages" },
  { id: 3, icon: BriefcaseIcon, name: "Emplois" },
  { id: 4, icon: Newspaper, name: "Actualités" },
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
      return "Marketplace";
    case 4:
      return "Fil d'actualité";
    case 12:
      return "Demandes d'amis";
    case 13:
      return "Rechercher des profils";
    default:
      return "Tableau de bord";
  }
};
