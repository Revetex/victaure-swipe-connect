
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
      id: "notifications-toggle",
    });
  };

  const switchId = "notifications-toggle";
  const switchLabel = "État des notifications";

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-between px-2 h-9 sm:h-10"
      asChild
    >
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" aria-hidden="true" />
          <label htmlFor={switchId} className="text-sm">{switchLabel}</label>
        </div>
        <Switch 
          id={switchId}
          checked={isEnabled}
          onCheckedChange={handleToggle}
          aria-label={switchLabel}
          title="Activer ou désactiver les notifications"
        />
      </div>
    </Button>
  );
}
