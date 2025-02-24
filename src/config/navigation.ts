
import { 
  User, 
  Newspaper, 
  MessageSquare, 
  BriefcaseIcon, 
  Bell, 
  Users, 
  ListTodo, 
  Calculator, 
  Languages, 
  Settings, 
  StickyNote,
  ShoppingBag,
  Gamepad2
} from "lucide-react";

export const navigationItems = [
  // Section principale
  { id: 1, icon: User, name: "Mon profil", route: "/profile" },
  { id: 4, icon: Newspaper, name: "Actualité", route: "/feed" },
  { id: 2, icon: MessageSquare, name: "Messages", route: "/messages" },
  { id: 17, icon: BriefcaseIcon, name: "Emplois", route: "/marketplace" },
  { id: 3, icon: ShoppingBag, name: "Marketplace", route: "/jobs" },
  { id: 18, icon: Gamepad2, name: "Jeux", route: "/lottery" },
  
  // Section réseau
  { id: 9, icon: Bell, name: "Notifications", route: "/notifications" },
  { id: 12, icon: Users, name: "Connections", route: "/connections" },
  
  // Outils
  { id: 7, icon: ListTodo, name: "Tâches", route: "/tasks" },
  { id: 8, icon: Calculator, name: "Calculatrice", route: "/calculator" },
  { id: 14, icon: Languages, name: "Traducteur", route: "/translator" },
  { id: 16, icon: StickyNote, name: "Notes", route: "/notes" },
  { id: 10, icon: Settings, name: "Paramètres", route: "/settings" }
] as const;

export const getPageTitle = (currentPage: number): string => {
  switch (currentPage) {
    case 1:
      return "Mon profil";
    case 2:
      return "Messages";
    case 3:
      return "Marketplace";
    case 4:
      return "Actualité";
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
    case 16:
      return "Notes";
    case 17:
      return "Emplois";
    case 18:
      return "Jeux";
    default:
      return "Actualité";
  }
};
