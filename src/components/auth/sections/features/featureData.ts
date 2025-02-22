
import { Bot, Wrench, Users, Timer } from "lucide-react";

export interface Feature {
  icon: typeof Bot | typeof Wrench | typeof Users | typeof Timer;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: Users,
    title: "Gratuit",
    description: "Pour chercheurs d'emploi"
  },
  {
    icon: Bot,
    title: "IA innovante",
    description: "Outils d'IA spécialisés"
  },
  {
    icon: Wrench,
    title: "Suite complète",
    description: "CV, lettres, analyses"
  },
  {
    icon: Timer,
    title: "Flexibilité",
    description: "Sans engagement"
  }
];
