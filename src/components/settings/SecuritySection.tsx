
import { Lock } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { PasswordChangeSection } from "./PasswordChangeSection";
import { Separator } from "@/components/ui/separator";

export function SecuritySection() {
  return (
    <SettingsSection>
      <div className="w-full space-y-1">
        <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span className="text-sm font-medium">Sécurité</span>
        </div>
        <div className="px-2">
          <PasswordChangeSection />
        </div>
      </div>
    </SettingsSection>
  );
}
