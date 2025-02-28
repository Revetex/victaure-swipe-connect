import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
export function NotificationsSection() {
  const [isEnabled, setIsEnabled] = useState(true);
  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    toast.success(`Notifications ${checked ? "activées" : "désactivées"}`, {
      id: "notifications-toggle"
    });
  };
  const switchId = "notifications-toggle";
  const switchLabel = "État des notifications";
  return <Button variant="ghost" size="sm" className="w-full justify-between px-2 h-9 sm:h-10" asChild>
      <div className="flex items-center bg-black">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" aria-hidden="true" />
          <label htmlFor={switchId} className="text-sm">{switchLabel}</label>
        </div>
        <Switch checked={isEnabled} onCheckedChange={handleToggle} id={switchId} aria-label={switchLabel} title="Activer ou désactiver les notifications" aria-describedby="notifications-description" />
        <span id="notifications-description" className="sr-only">
          {isEnabled ? "Désactiver les notifications" : "Activer les notifications"}
        </span>
      </div>
    </Button>;
}