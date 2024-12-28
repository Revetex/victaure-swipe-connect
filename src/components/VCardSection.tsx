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
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-indigo-600 dark:text-indigo-400">{icon}</span>}
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}