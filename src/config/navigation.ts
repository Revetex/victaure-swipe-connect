
import { UserCircle, MessageSquare, BriefcaseIcon, Settings, Newspaper } from "lucide-react";

export const navigationItems = [
  { id: 1, icon: UserCircle, name: "Profil", description: "Gérer votre profil" },
  { id: 2, icon: MessageSquare, name: "Messages", description: "Voir vos messages" },
  { id: 3, icon: BriefcaseIcon, name: "Emplois", description: "Parcourir les emplois" },
  { id: 4, icon: Newspaper, name: "Actualités", description: "Fil d'actualité" },
  { id: 5, icon: Settings, name: "Paramètres", description: "Configurer votre compte" }
] as const;

export const getPageTitle = (currentPage: number): string => {
  const item = navigationItems.find(item => item.id === currentPage);
  return item?.name || "Tableau de bord";
};

export const getPageDescription = (currentPage: number): string => {
  const item = navigationItems.find(item => item.id === currentPage);
  return item?.description || "";
};
