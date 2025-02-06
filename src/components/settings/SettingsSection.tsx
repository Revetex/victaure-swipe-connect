import { Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({ title, children, className }: SettingsSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 text-primary border-b pb-2">
        <Settings2 className="h-5 w-5" />
        <h3 className="font-medium text-lg">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}