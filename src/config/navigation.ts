
import { MessageSquare, BriefcaseIcon, ListTodo, Bell, Calculator, Languages, Settings, Newspaper, SwordIcon, StickyNote, Users, Search, LayoutGrid, Menu, EyeOff, ShoppingBag } from "lucide-react";
import { LucideIcon } from "lucide-react";

type NavigationItem = {
  id: number;
  icon: LucideIcon;
  name: string;
  path: string;
  hidden?: boolean;
  children?: {
    id: number;
    icon: LucideIcon;
    name: string;
    path: string;
    hidden?: boolean;
  }[];
};

export const navigationItems: NavigationItem[] = [
  // Pages principales
  { id: 4, icon: Newspaper, name: "Actualité", path: "dashboard" },
  { id: 16, icon: StickyNote, name: "Notes", path: "notes" },
  
  // Commerce & Jeux
  { id: 3, icon: ShoppingBag, name: "Marketplace", path: "marketplace" },
  { id: 7, icon: SwordIcon, name: "Échecs", path: "chess" },
  
  // Productivité
  { id: 6, icon: ListTodo, name: "Tâches", path: "tasks" },
  { id: 8, icon: Calculator, name: "Calculatrice", path: "calculator" },
  { id: 14, icon: Languages, name: "Traducteur", path: "translator" },
  
  // Social
  { id: 12, icon: Users, name: "Connections", path: "connections" },
  { id: 2, icon: MessageSquare, name: "Messages", path: "messages" },
  
  // Paramètres
  { id: 10, icon: Settings, name: "Paramètres", path: "settings" }
];

export const getPageTitle = (currentPage: number): string => {
  switch (currentPage) {
    case 2:
      return "Messages";
    case 3:
      return "Marketplace";
    case 4:
      return "Actualité";
    case 6:
      return "Tâches";
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
