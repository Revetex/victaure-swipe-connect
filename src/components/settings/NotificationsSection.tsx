
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export function NotificationsSection() {
  const [isEnabled, setIsEnabled] = useState(true);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    toast.success(
      `Notifications ${checked ? "activées" : "désactivées"}`,
      { id: "notifications-toggle" }
    );
  };

  const switchId = "notifications-toggle";
  const switchLabel = "État des notifications";

  return (
    <div className="flex items-center justify-between w-full px-2 py-3 hover:bg-white/5 rounded-md transition-colors">
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 text-[#64B5D9]" aria-hidden="true" />
        <label htmlFor={switchId} className="text-sm">{switchLabel}</label>
      </div>
      
      <Switch
        checked={isEnabled}
        onCheckedChange={handleToggle}
        id={switchId}
        aria-label={switchLabel}
        title="Activer ou désactiver les notifications"
        aria-describedby="notifications-description"
        className="data-[state=checked]:bg-[#64B5D9]"
      />
      
      <span id="notifications-description" className="sr-only">
        {isEnabled ? "Désactiver les notifications" : "Activer les notifications"}
      </span>
    </div>
  );
}
