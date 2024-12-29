import { GeneralSettings } from "./settings/GeneralSettings";
import { NotificationSettings } from "./settings/NotificationSettings";
import { LogoutButton } from "./settings/LogoutButton";

export function Settings() {
  return (
    <div className="space-y-6 p-4">
      <GeneralSettings />
      <NotificationSettings />
      <LogoutButton />
    </div>
  );
}