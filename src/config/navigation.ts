
import { DashboardConfig } from "@/types/dashboard";
import { 
  Home, 
  Briefcase, 
  ShoppingBag, 
  MessageSquare,
  Gamepad,
  Wrench,
  Settings,
  Bell 
} from "lucide-react";

export interface NavigationItem {
  id: number;
  name: string;
  href: string;
  icon: any;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 1,
    name: "Accueil",
    href: "/dashboard",
    icon: Home
  },
  {
    id: 2,
    name: "Emplois",
    href: "/dashboard/jobs",
    icon: Briefcase
  },
  {
    id: 3,
    name: "Marketplace",
    href: "/dashboard/marketplace",
    icon: ShoppingBag
  },
  {
    id: 4,
    name: "Messages",
    href: "/dashboard/messages",
    icon: MessageSquare
  },
  {
    id: 5,
    name: "Jeux",
    href: "/dashboard/games",
    icon: Gamepad
  },
  {
    id: 6,
    name: "Outils",
    href: "/dashboard/tools",
    icon: Wrench
  },
  {
    id: 7,
    name: "Paramètres",
    href: "/dashboard/settings",
    icon: Settings
  },
  {
    id: 9,
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell
  }
];

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Accueil",
      href: "/dashboard",
    },
    {
      title: "Emplois",
      href: "/dashboard/jobs",
    },
    {
      title: "Marketplace",
      href: "/dashboard/marketplace",
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
    },
  ],
  sidebarNav: [
    {
      title: "Jeux",
      href: "/dashboard/games",
      icon: "gamepad",
    },
    {
      title: "Outils",
      href: "/dashboard/tools",
      icon: "tools",
    },
    {
      title: "Paramètres",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};
