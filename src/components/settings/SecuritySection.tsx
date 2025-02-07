
import { Lock } from "lucide-react";
import { SettingsSection } from "./SettingsSection";
import { PasswordChangeSection } from "./PasswordChangeSection";

export function SecuritySection() {
  return (
    <SettingsSection title="Sécurité">
      <div className="w-full space-y-1">
        <div className="px-2">
          <PasswordChangeSection />
        </div>
      </div>
    </SettingsSection>
  );
}

