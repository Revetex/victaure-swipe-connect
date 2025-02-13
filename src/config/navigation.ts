
import { 
  Home,
  MessageSquare, 
  ListTodo, 
  Calculator, 
  Languages, 
  Settings, 
  ShoppingBag,
  Sword,
  StickyNote,
  Users,
  Bell,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export type NavigationItem = {
  id: number;
  icon: LucideIcon;
  name: string;
  path: string;
  description: string;
  badge?: string;
};

export type NavigationSection = {
  id: string;
  name: string;
  description: string;
  items: NavigationItem[];
};

export const navigationItems: NavigationItem[] = [
  { 
    id: 1, 
    icon: Home, 
    name: "Tableau de bord", 
    path: "/dashboard",
    description: "Tableau de bord principal",
  },
  { 
    id: 2, 
    icon: MessageSquare, 
    name: "Messages", 
    path: "/dashboard/messages",
    description: "Messagerie instantanée"
  },
  { 
    id: 3, 
    icon: Users, 
    name: "Communauté", 
    path: "/dashboard/community",
    description: "Réseau social",
  },
  { 
    id: 4, 
    icon: ShoppingBag, 
    name: "Marketplace", 
    path: "/dashboard/marketplace",
    description: "Achats et ventes"
  },
  { 
    id: 5, 
    icon: StickyNote, 
    name: "Notes", 
    path: "/dashboard/notes",
    description: "Gestionnaire de notes"
  },
  { 
    id: 6, 
    icon: ListTodo, 
    name: "Tâches", 
    path: "/dashboard/tasks",
    description: "Gestionnaire de tâches"
  },
  { 
    id: 7, 
    icon: Calculator, 
    name: "Calculatrice", 
    path: "/dashboard/calculator",
    description: "Outil de calcul"
  },
  { 
    id: 8, 
    icon: Languages, 
    name: "Traducteur", 
    path: "/dashboard/translator",
    description: "Traduction instantanée"
  },
  { 
    id: 9, 
    icon: Sword, 
    name: "Échecs", 
    path: "/dashboard/chess",
    description: "Jeu d'échecs en ligne"
  },
  { 
    id: 10, 
    icon: Bell, 
    name: "Notifications", 
    path: "/dashboard/notifications",
    description: "Centre de notifications"
  },
  { 
    id: 11, 
    icon: Settings, 
    name: "Paramètres", 
    path: "/dashboard/settings",
    description: "Configuration du compte"
  }
];

export const navigationSections: NavigationSection[] = [
  {
    id: "main",
    name: "Principal",
    description: "Sections principales",
    items: navigationItems.slice(0, 4) // Tableau de bord, Messages, Communauté, Marketplace
  },
  {
    id: "productivity",
    name: "Productivité",
    description: "Organisation et gestion",
    items: navigationItems.slice(4, 6) // Notes, Tâches
  },
  {
    id: "tools",
    name: "Outils",
    description: "Utilitaires et divertissement",
    items: navigationItems.slice(6, 9) // Calculatrice, Traducteur, Échecs
  },
  {
    id: "system",
    name: "Système",
    description: "Paramètres et notifications",
    items: navigationItems.slice(9) // Notifications, Paramètres
  }
];

export const getPageTitle = (currentPage: number): string => {
  const item = navigationItems.find(item => item.id === currentPage);
  return item?.name || "Tableau de bord";
};
