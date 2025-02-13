
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
  Briefcase,
  Folder,
  GraduationCap
} from "lucide-react";
import { LucideIcon } from "lucide-react";

type NavigationItem = {
  id: number;
  icon: LucideIcon;
  name: string;
  path: string;
  section?: string;
  hidden?: boolean;
};

export const navigationSections = [
  {
    id: "essential",
    name: "Essentiel",
    items: [
      { id: 4, icon: Newspaper, name: "Actualité", path: "dashboard" },
      { id: 2, icon: MessageSquare, name: "Messages", path: "messages" },
      { id: 12, icon: Users, name: "Connections", path: "connections" }
    ]
  },
  {
    id: "tools",
    name: "Outils",
    items: [
      { id: 6, icon: ListTodo, name: "Tâches", path: "tasks" },
      { id: 16, icon: StickyNote, name: "Notes", path: "notes" },
      { id: 8, icon: Calculator, name: "Calculatrice", path: "calculator" },
      { id: 14, icon: Languages, name: "Traducteur", path: "translator" }
    ]
  },
  {
    id: "activities",
    name: "Activités",
    items: [
      { id: 3, icon: ShoppingBag, name: "Marketplace", path: "marketplace" },
      { id: 7, icon: SwordIcon, name: "Échecs", path: "chess" }
    ]
  },
  {
    id: "settings",
    name: "Paramètres",
    items: [
      { id: 10, icon: Settings, name: "Paramètres", path: "settings" }
    ]
  }
];

export const navigationItems = navigationSections.flatMap(section => section.items);

export const getPageTitle = (currentPage: number): string => {
  const item = navigationItems.find(item => item.id === currentPage);
  return item?.name || "Actualité";
};
