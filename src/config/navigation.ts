
import { MessageSquare, BriefcaseIcon, ListTodo, Bell, Calculator, Languages, Settings, Newspaper, SwordIcon, StickyNote, User, Users, Search, LayoutGrid, Menu, EyeOff, ShoppingBag } from "lucide-react";
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
  // Pages principales
  { id: 1, icon: User, name: "Profil" },
  { id: 4, icon: Newspaper, name: "Actualité" },
  { id: 16, icon: StickyNote, name: "Notes" },
  { id: 3, icon: ShoppingBag, name: "Marketplace" },
  
  // Jeux et outils
  { id: 7, icon: SwordIcon, name: "Échecs" },
  { id: 8, icon: Calculator, name: "Calculatrice" },
  { id: 14, icon: Languages, name: "Traducteur" },
  { id: 12, icon: Users, name: "Connections" },
  
  // Messages et paramètres
  { id: 2, icon: MessageSquare, name: "Messages" },
  { id: 10, icon: Settings, name: "Paramètres" }
];

export const getPageTitle = (currentPage: number): string => {
  switch (currentPage) {
    case 1:
      return "Profil";
    case 2:
      return "Messages";
    case 3:
      return "Marketplace";
    case 4:
      return "Actualité";
    case 7:
      return "Échecs";
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
    case 16:
      return "Notes";
    default:
      return "Actualité";
  }
};
