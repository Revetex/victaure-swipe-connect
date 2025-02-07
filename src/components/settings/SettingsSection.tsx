
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SettingsSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SettingsSection({ title, children, className }: SettingsSectionProps) {
  return (
    <div className={cn("mb-2", className)}>
      <div className="w-full space-y-1">
        {children}
      </div>
    </div>
  );
}

