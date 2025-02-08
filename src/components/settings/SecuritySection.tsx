
import { Lock } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { PasswordChangeSection } from "./PasswordChangeSection";

export function SecuritySection() {
  return (
    <SettingsSection title="Sécurité">
      <div className="space-y-3 p-3 rounded-lg bg-muted/30">
        <div className="flex items-center gap-2 text-foreground/80">
          <Lock className="h-4 w-4" />
          <h3 className="text-sm font-medium">Mot de passe</h3>
        </div>
        <PasswordChangeSection />
      </div>
    </SettingsSection>
  );
}
