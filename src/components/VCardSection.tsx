import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VCardSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "education" | "experience";
}

export function VCardSection({ 
  title, 
  icon, 
  children,
  variant = "default" 
}: VCardSectionProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "education":
        return "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200/50 dark:border-indigo-800/30";
      case "experience":
        return "bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/50 dark:border-purple-800/30";
      default:
        return "bg-card/5 border-border/10";
    }
  };

  return (
    <section className={cn(
      "rounded-xl border backdrop-blur-sm transition-colors duration-200",
      "p-0 sm:p-6 space-y-4",
      getVariantStyles()
    )}>
      <div className="flex items-center gap-2 pb-2 border-b border-border/10 px-4 sm:px-0">
        {icon && (
          <span className="shrink-0 text-muted-foreground">
            {icon}
          </span>
        )}
        <h2 className="text-lg sm:text-xl font-semibold">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}