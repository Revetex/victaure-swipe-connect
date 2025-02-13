
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
    name: "Accueil", 
    path: "home",
    description: "Tableau de bord principal",
    badge: "New"
  },
  { 
    id: 2, 
    icon: MessageSquare, 
    name: "Messages", 
    path: "messages",
    description: "Messagerie instantanée"
  },
  { 
    id: 3, 
    icon: ShoppingBag, 
    name: "Marketplace", 
    path: "marketplace",
    description: "Achats et ventes"
  },
  { 
    id: 4, 
    icon: Users, 
    name: "Communauté", 
    path: "community",
    description: "Réseau social"
  },
  { 
    id: 7, 
    icon: Sword, 
    name: "Échecs", 
    path: "chess",
    description: "Jeu d'échecs en ligne"
  },
  { 
    id: 8, 
    icon: Calculator, 
    name: "Calculatrice", 
    path: "calculator",
    description: "Outil de calcul",
  },
  { 
    id: 9, 
    icon: Bell, 
    name: "Notifications", 
    path: "notifications",
    description: "Centre de notifications"
  },
  { 
    id: 10, 
    icon: Settings, 
    name: "Paramètres", 
    path: "settings",
    description: "Configuration du compte"
  },
  { 
    id: 14, 
    icon: Languages, 
    name: "Traducteur", 
    path: "translator",
    description: "Traduction instantanée"
  },
  { 
    id: 16, 
    icon: StickyNote, 
    name: "Notes", 
    path: "notes",
    description: "Gestionnaire de notes"
  }
];

export const navigationSections: NavigationSection[] = [
  {
    id: "essentials",
    name: "Essentiel",
    description: "Fonctionnalités principales de l'application",
    items: navigationItems.slice(0, 4)
  },
  {
    id: "tools",
    name: "Outils",
    description: "Outils et fonctionnalités additionnelles",
    items: navigationItems.slice(4, 7)
  },
  {
    id: "system",
    name: "Système",
    description: "Paramètres et configuration du système",
    items: navigationItems.slice(7)
  }
];

export const getPageTitle = (currentPage: number): string => {
  const item = navigationItems.find(item => item.id === currentPage);
  return item?.name || "Accueil";
};
