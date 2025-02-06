
import { Lock } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { PasswordChangeSection } from "./PasswordChangeSection";

export function SecuritySection() {
  return (
    <SettingsSection title="Sécurité">
      <div className={cn(
        "space-y-3 p-4 rounded-lg",
        "bg-muted/5 hover:bg-muted/10 transition-colors",
        "dark:bg-muted/10 dark:hover:bg-muted/20",
        "border border-border/10"
      )}>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          <h3 className="text-sm font-medium">Changer le mot de passe</h3>
        </div>
        <PasswordChangeSection />
      </div>
    </SettingsSection>
  );
}
