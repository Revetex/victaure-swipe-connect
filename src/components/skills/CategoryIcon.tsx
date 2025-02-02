import { Code, Palette, Briefcase, Wrench, Users, Folder } from "lucide-react";

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const defaultClass = className || "h-4 w-4";
  
  switch (category.toLowerCase()) {
    case "développement":
      return <Code className={`${defaultClass} text-indigo-600 dark:text-indigo-400`} />;
    case "design":
      return <Palette className={`${defaultClass} text-pink-600 dark:text-pink-400`} />;
    case "gestion":
      return <Briefcase className={`${defaultClass} text-blue-600 dark:text-blue-400`} />;
    case "manuel":
      return <Wrench className={`${defaultClass} text-green-600 dark:text-green-400`} />;
    case "soft skills":
      return <Users className={`${defaultClass} text-purple-600 dark:text-purple-400`} />;
    default:
      return <Folder className={`${defaultClass} text-gray-600 dark:text-gray-400`} />;
  }
}