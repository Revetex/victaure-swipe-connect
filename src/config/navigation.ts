
import { DashboardConfig } from "@/types/dashboard";

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
