
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VCardSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "education" | "experience";
  headerAction?: ReactNode;
}

export function VCardSection({ 
  title, 
  icon, 
  children, 
  variant = "default",
  headerAction 
}: VCardSectionProps) {
  return (
    <div className="w-full bg-white/50 dark:bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-purple-600 dark:text-purple-400">
              {icon}
            </span>
          )}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        {headerAction && (
          <div>
            {headerAction}
          </div>
        )}
      </div>
      <div className={cn(
        "w-full",
        variant === "education" && "space-y-6",
        variant === "experience" && "space-y-6"
      )}>
        {children}
      </div>
    </div>
  );
}
