import { ReactNode } from "react";

interface VCardSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function VCardSection({ title, children, className, icon }: VCardSectionProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-foreground/80">{title}</h3>
      </div>
      {children}
    </div>
  );
}