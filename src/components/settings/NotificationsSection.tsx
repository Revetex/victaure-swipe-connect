
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NotificationsSection() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-between px-2 h-9"
      asChild
    >
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="text-sm">Notifications</span>
        </div>
        <Switch 
          defaultChecked 
          onCheckedChange={(checked) => {
            toast.success(`Notifications ${checked ? "activées" : "désactivées"}`);
          }}
          aria-label="Activer ou désactiver les notifications"
        />
      </div>
    </Button>
  );
}
