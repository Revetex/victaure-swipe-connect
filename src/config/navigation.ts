import { UserCircle, MessageSquare, Users, Bell, Briefcase, Wrench, Settings } from "lucide-react";

export const navigationItems = [
  { id: 1, icon: UserCircle, name: "Profil" },
  { id: 2, icon: MessageSquare, name: "Messages" },
  { id: 3, icon: Briefcase, name: "Emploi" },
  { id: 4, icon: Bell, name: "Notifications" },
  { id: 5, icon: Wrench, name: "Outils" },
  { id: 6, icon: Settings, name: "Paramètres" }
] as const;

export const getPageTitle = (currentPage: number): string => {
  switch (currentPage) {
    case 1:
      return "Tableau de bord";
    case 2:
      return "Messages";
    case 3:
      return "Emploi";
    case 4:
      return "Notifications";
    case 5:
      return "Outils";
    case 6:
      return "Paramètres";
    default:
      return "Tableau de bord";
  }
};