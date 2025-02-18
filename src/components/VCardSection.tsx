import { ReactNode } from "react";

interface VCardSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "education" | "experience";
}

export function VCardSection({ title, icon, children, variant = "default" }: VCardSectionProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 px-4 mb-4">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="w-full px-4 sm:px-0">
        {children}
      </div>
    </div>
  );
}