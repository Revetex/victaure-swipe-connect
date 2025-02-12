import { MessageSquare, BriefcaseIcon, ListTodo, Bell, Calculator, Languages, Settings, Newspaper, SwordIcon, StickyNote, User, Users, Search, LayoutGrid, Menu, EyeOff } from "lucide-react";
import { LucideIcon } from "lucide-react";

type NavigationItem = {
  id: number;
  icon: LucideIcon;
  name: string;
  hidden?: boolean;
  children?: {
    id: number;
    icon: LucideIcon;
    name: string;
    hidden?: boolean;
  }[];
};

export const navigationItems: NavigationItem[] = [
  // Principal
  { id: 1, icon: User, name: "Mon profil" },
  { id: 4, icon: Newspaper, name: "Actualité" },
  { id: 3, icon: BriefcaseIcon, name: "Emplois" },
  { id: 12, icon: Users, name: "Connections" },
  
  // Outils rapides
  { id: 8, icon: Calculator, name: "Calculatrice" },
  { id: 14, icon: Languages, name: "Traducteur" },
  { id: 16, icon: StickyNote, name: "Notes" },
  
  // Settings et Messages (cachés par défaut)
  { id: 2, icon: MessageSquare, name: "Messages", hidden: true },
  { id: 10, icon: Settings, name: "Paramètres" }
];

export const getPageTitle = (currentPage: number): string => {
  switch (currentPage) {
    case 1:
      return "Mon profil";
    case 2:
      return "Messages";
    case 3:
      return "Emplois";
    case 4:
      return "Actualité";
    case 5:
      return "Outils";
    case 7:
      return "Tâches";
    case 8:
      return "Calculatrice";
    case 9:
      return "Notifications";
    case 10:
      return "Paramètres";
    case 12:
      return "Connections";
    case 14:
      return "Traducteur";
    case 15:
      return "Échecs";
    case 16:
      return "Notes";
    default:
      return "Actualité";
  }
};
