import { UserCircle, MessageSquare, BriefcaseIcon, Settings, Newspaper, Wrench } from "lucide-react";

export const navigationItems = [
  { id: 1, icon: UserCircle, name: "Profil" },
  { id: 2, icon: MessageSquare, name: "Messages" },
  { id: 3, icon: BriefcaseIcon, name: "Emplois" },
  { id: 4, icon: Newspaper, name: "Actualités" },
  { id: 5, icon: Wrench, name: "Outils" },
  { id: 6, icon: Settings, name: "Paramètres" }
] as const;