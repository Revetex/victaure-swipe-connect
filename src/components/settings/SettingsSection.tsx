import { Settings2 } from "lucide-react";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-primary">
        <Settings2 className="h-5 w-5" />
        <h3 className="font-medium">{title}</h3>
      </div>
      {children}
    </div>
  );
}