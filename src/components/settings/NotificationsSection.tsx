
import { Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SettingsSection } from "./SettingsSection";

export function NotificationsSection() {
  return (
    <SettingsSection title="Notifications">
      <div className={cn(
        "flex items-center justify-between p-4 rounded-lg",
        "bg-muted/5 hover:bg-muted/10 transition-colors",
        "dark:bg-muted/10 dark:hover:bg-muted/20",
        "border border-border/10",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      )}>
        <Label className="text-sm cursor-pointer flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Activer les notifications
        </Label>
        <Switch 
          defaultChecked 
          onCheckedChange={(checked) => {
            toast.success(`Notifications ${checked ? "activées" : "désactivées"}`);
          }}
        />
      </div>
    </SettingsSection>
  );
}
