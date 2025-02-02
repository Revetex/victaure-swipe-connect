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
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}