import { Code2, Briefcase, Wrench, PenTool, Building2, HelpCircle } from "lucide-react";

interface CategoryIconProps {
  category: string;
  className?: string;
}

export function CategoryIcon({ category, className }: CategoryIconProps) {
  switch (category?.toLowerCase()) {
    case "technology":
      return <Code2 className={className} />;
    case "business":
      return <Briefcase className={className} />;
    case "trades":
      return <Wrench className={className} />;
    case "creative":
      return <PenTool className={className} />;
    case "professional":
      return <Building2 className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
}