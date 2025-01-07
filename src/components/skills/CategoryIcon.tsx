import { Code, Briefcase, PenTool, Building2, Wrench, HelpCircle } from "lucide-react";

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className = "" }: CategoryIconProps) {
  switch (category.toLowerCase()) {
    case "technology":
      return <Code className={className} />;
    case "business":
      return <Briefcase className={className} />;
    case "design":
      return <PenTool className={className} />;
    case "engineering":
      return <Wrench className={className} />;
    case "corporate":
      return <Building2 className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}