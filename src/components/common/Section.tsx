
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SectionProps {
  title?: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
}

export function Section({
  title,
  icon: Icon,
  children,
  className,
  headerActions
}: SectionProps) {
  return (
    <div className={cn("content-section", className)}>
      {(title || headerActions) && (
        <div className="section-header">
          {title && (
            <h2 className="section-title">
              {Icon && <Icon className="h-5 w-5 text-[#64B5D9]" />}
              {title}
            </h2>
          )}
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
