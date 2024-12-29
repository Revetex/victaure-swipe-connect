import { Brain, Briefcase, Code, Palette, Tool, Users, Wrench } from "lucide-react";

interface CategoryIconProps {
  category: string;
}

export function CategoryIcon({ category }: CategoryIconProps) {
  switch (category.toLowerCase()) {
    case "développement":
      return <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />;
    case "design":
      return <Palette className="h-4 w-4 text-pink-600 dark:text-pink-400" />;
    case "gestion":
      return <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case "construction":
      return <Tool className="h-4 w-4 text-orange-600 dark:text-orange-400" />;
    case "manuel":
      return <Wrench className="h-4 w-4 text-green-600 dark:text-green-400" />;
    case "soft skills":
      return <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    default:
      return <Brain className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
  }
}