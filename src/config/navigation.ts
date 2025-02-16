
import { 
  Home,
  BriefcaseIcon,
  MessageSquare, 
  Bell, 
  Users, 
  ListTodo, 
  Calculator, 
  Languages, 
  Settings, 
  SwordIcon, 
  StickyNote,
  ShoppingBag
} from "lucide-react";

export const navigationItems = [
  // Menu principal
  { id: 4, icon: Home, name: "Accueil" },
  { id: 3, icon: BriefcaseIcon, name: "Emplois" },
  { id: 2, icon: MessageSquare, name: "Messages" },
  { id: 12, icon: Users, name: "Réseau" },
  { id: 17, icon: ShoppingBag, name: "Marketplace" },
  
  // Notifications
  { id: 9, icon: Bell, name: "Notifications" },
  
  // Outils
  { id: 7, icon: ListTodo, name: "Tâches" },
  { id: 8, icon: Calculator, name: "Calculatrice" },
  { id: 14, icon: Languages, name: "Traducteur" },
  { id: 15, icon: SwordIcon, name: "Échecs" },
  { id: 16, icon: StickyNote, name: "Notes" },
  { id: 10, icon: Settings, name: "Paramètres" }
] as const;

export const getPageTitle = (currentPage: number): string => {
  switch (currentPage) {
    case 2:
      return "Messages";
    case 3:
      return "Emplois";
    case 4:
      return "Accueil";
    case 7:
      return "Tâches";
    case 8:
      return "Calculatrice";
    case 9:
      return "Notifications";
    case 10:
      return "Paramètres";
    case 12:
      return "Réseau";
    case 14:
      return "Traducteur";
    case 15:
      return "Échecs";
    case 16:
      return "Notes";
    case 17:
      return "Marketplace";
    default:
      return "Accueil";
  }
};
