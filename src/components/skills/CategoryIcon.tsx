import { Code, Wrench, PaintBucket, Briefcase, Brain } from "lucide-react";

interface CategoryIconProps {
  category: string;
}

export function CategoryIcon({ category }: CategoryIconProps) {
  switch (category) {
    case "Développement":
      return <Code className="h-4 w-4" />;
    case "DevOps":
      return <Wrench className="h-4 w-4" />;
    case "Design":
      return <PaintBucket className="h-4 w-4" />;
    case "Gestion":
      return <Briefcase className="h-4 w-4" />;
    case "Construction":
      return <Wrench className="h-4 w-4" />;
    case "Manuel":
      return <Brain className="h-4 w-4" />;
    default:
      return null;
  }
}