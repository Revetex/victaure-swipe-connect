import { Brain, Briefcase, Code, Palette, Hammer, Users, Wrench } from "lucide-react";

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  switch (category.toLowerCase()) {
    case "développement":
      return <Code className={className || "h-4 w-4 text-indigo-600 dark:text-indigo-400"} />;
    case "design":
      return <Palette className={className || "h-4 w-4 text-pink-600 dark:text-pink-400"} />;
    case "gestion":
      return <Briefcase className={className || "h-4 w-4 text-blue-600 dark:text-blue-400"} />;
    case "construction":
      return <Hammer className={className || "h-4 w-4 text-orange-600 dark:text-orange-400"} />;
    case "manuel":
      return <Wrench className={className || "h-4 w-4 text-green-600 dark:text-green-400"} />;
    case "soft skills":
      return <Users className={className || "h-4 w-4 text-purple-600 dark:text-purple-400"} />;
    default:
      return <Brain className={className || "h-4 w-4 text-gray-600 dark:text-gray-400"} />;
  }
}