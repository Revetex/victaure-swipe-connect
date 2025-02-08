
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
        "flex items-center justify-between p-3 rounded-lg bg-muted/30",
        "hover:bg-muted/50 dark:hover:bg-muted/40 transition-colors",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      )}>
        <Label className="text-sm cursor-pointer flex items-center gap-2 text-foreground/80">
          <Bell className="h-4 w-4" />
          Notifications
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
