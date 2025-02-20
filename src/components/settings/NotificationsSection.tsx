
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export function NotificationsSection() {
  const [isEnabled, setIsEnabled] = useState(true);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    // Éviter les toasts multiples en utilisant un ID unique
    toast.success(`Notifications ${checked ? "activées" : "désactivées"}`, {
      id: "notifications-toggle",
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-between px-2 h-9 sm:h-10"
      asChild
    >
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="text-sm">Notifications</span>
        </div>
        <Switch 
          checked={isEnabled}
          onCheckedChange={handleToggle}
        />
      </div>
    </Button>
  );
}
