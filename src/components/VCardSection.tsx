import { ReactNode } from "react";

interface VCardSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function VCardSection({ title, children, className }: VCardSectionProps) {
  return (
    <div className={className}>
      <h3 className="font-semibold mb-2 text-foreground/80">{title}</h3>
      {children}
    </div>
  );
}