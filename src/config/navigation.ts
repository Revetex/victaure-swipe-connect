
import { 
  MessageSquare, 
  ListTodo, 
  Calculator, 
  Languages, 
  Settings, 
  Newspaper, 
  SwordIcon, 
  StickyNote, 
  Users, 
  ShoppingBag,
  Home,
  Bell,
  CircleUser,
  FileText,
  LayoutDashboard
} from "lucide-react";
import { LucideIcon } from "lucide-react";

type NavigationItem = {
  id: number;
  icon: LucideIcon;
  name: string;
  path: string;
  description?: string;
  section?: string;
};

export const navigationSections = [
  {
    id: "accueil",
    name: "Accueil",
    description: "Votre espace principal",
    items: [
      { 
        id: 4, 
        icon: LayoutDashboard, 
        name: "Tableau de bord", 
        path: "dashboard",
        description: "Vue d'ensemble de vos activités"
      }
    ]
  },
  {
    id: "communication",
    name: "Communication",
    description: "Restez connecté",
    items: [
      { 
        id: 2, 
        icon: MessageSquare, 
        name: "Messages", 
        path: "messages",
        description: "Vos conversations"
      },
      { 
        id: 12, 
        icon: Users, 
        name: "Connections", 
        path: "connections",
        description: "Votre réseau professionnel"
      }
    ]
  },
  {
    id: "productivite",
    name: "Productivité",
    description: "Outils et ressources",
    items: [
      { 
        id: 16, 
        icon: StickyNote, 
        name: "Notes", 
        path: "notes",
        description: "Vos notes et mémos"
      },
      { 
        id: 6, 
        icon: ListTodo, 
        name: "Tâches", 
        path: "tasks",
        description: "Gestionnaire de tâches"
      },
      { 
        id: 8, 
        icon: Calculator, 
        name: "Calculatrice", 
        path: "calculator",
        description: "Calculs rapides"
      },
      { 
        id: 14, 
        icon: Languages, 
        name: "Traducteur", 
        path: "translator",
        description: "Traduction instantanée"
      }
    ]
  },
  {
    id: "loisirs",
    name: "Loisirs",
    description: "Détente et divertissement",
    items: [
      { 
        id: 3, 
        icon: ShoppingBag, 
        name: "Marketplace", 
        path: "marketplace",
        description: "Achats et ventes"
      },
      { 
        id: 7, 
        icon: SwordIcon, 
        name: "Échecs", 
        path: "chess",
        description: "Jouez aux échecs"
      }
    ]
  },
  {
    id: "compte",
    name: "Compte",
    description: "Gérez votre profil",
    items: [
      { 
        id: 10, 
        icon: Settings, 
        name: "Paramètres", 
        path: "settings",
        description: "Configuration du compte"
      }
    ]
  }
];

export const navigationItems = navigationSections.flatMap(section => section.items);

export const getPageTitle = (currentPage: number): string => {
  const item = navigationItems.find(item => item.id === currentPage);
  return item?.name || "Tableau de bord";
};

export const getCurrentSection = (currentPage: number): string => {
  const item = navigationItems.find(item => item.id === currentPage);
  const section = navigationSections.find(section => 
    section.items.some(i => i.id === currentPage)
  );
  return section?.name || "Accueil";
};
