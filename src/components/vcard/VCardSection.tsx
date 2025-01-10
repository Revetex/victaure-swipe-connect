import { ReactNode } from "react";

interface VCardSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export function VCardSection({ title, icon, children }: VCardSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}