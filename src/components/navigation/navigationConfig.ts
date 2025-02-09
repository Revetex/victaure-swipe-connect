
import { 
  MessageSquare, 
  Settings, 
  ListTodo, 
  Calculator, 
  Languages, 
  Sword, 
  Users, 
  UserPlus,
  LayoutDashboard 
} from "lucide-react";
import { NavigationSection } from "./types";

export const navigationSections: NavigationSection[] = [
  {
    title: 'Principal',
    items: [
      { icon: LayoutDashboard, label: 'Tableau de bord', to: '/dashboard' },
      { icon: MessageSquare, label: 'Messages', to: '/dashboard/messages' },
    ]
  },
  {
    title: 'Outils',
    items: [
      { icon: ListTodo, label: 'Notes & Tâches', to: '/dashboard/tools' },
      { icon: Calculator, label: 'Calculatrice', to: '/dashboard/tools?tool=calculator' },
      { icon: Languages, label: 'Traducteur', to: '/dashboard/tools?tool=translator' },
      { icon: Sword, label: 'Échecs', to: '/dashboard/tools?tool=chess' },
    ]
  },
  {
    title: 'Social',
    items: [
      { icon: Users, label: 'Mes Connections', to: '/dashboard/connections' },
      { icon: UserPlus, label: 'Demandes en attente', to: '/dashboard/requests' },
    ]
  },
  {
    title: 'Paramètres',
    items: [
      { icon: Settings, label: 'Paramètres', to: '/settings' },
    ]
  }
];
