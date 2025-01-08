import { Bell, Globe, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";
import { SettingsSection } from "./SettingsSection";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface DevicePreferences {
  enableNotifications: boolean;
  enableLocationServices: boolean;
  enableAutoUpdate: boolean;
}

export function DevicePreferencesSection() {
  const [devicePreferences, setDevicePreferences] = useState<DevicePreferences>({
    enableNotifications: true,
    enableLocationServices: false,
    enableAutoUpdate: true
  });

  const updateDevicePreference = async (key: keyof DevicePreferences, value: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const dbKey = key === 'enableNotifications' ? 'notifications_enabled' :
                   key === 'enableLocationServices' ? 'location_enabled' :
                   'auto_update_enabled';

      const { error } = await supabase
        .from('profiles')
        .update({ [dbKey]: value })
        .eq('id', user.id);

      if (error) throw error;

      setDevicePreferences(prev => ({ ...prev, [key]: value }));
      toast.success("Préférences mises à jour");
    } catch (error) {
      console.error("Error updating preference:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <SettingsSection title="Préférences d'appareil">
        <div className="space-y-4">
          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            "hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          )}>
            <Label className="text-sm cursor-pointer flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </Label>
            <Switch 
              checked={devicePreferences.enableNotifications}
              onCheckedChange={(checked) => {
                updateDevicePreference('enableNotifications', checked);
              }}
            />
          </div>

          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            "hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          )}>
            <Label className="text-sm cursor-pointer flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Services de localisation
            </Label>
            <Switch 
              checked={devicePreferences.enableLocationServices}
              onCheckedChange={(checked) => {
                updateDevicePreference('enableLocationServices', checked);
              }}
            />
          </div>

          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            "hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          )}>
            <Label className="text-sm cursor-pointer flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Mise à jour automatique
            </Label>
            <Switch 
              checked={devicePreferences.enableAutoUpdate}
              onCheckedChange={(checked) => {
                updateDevicePreference('enableAutoUpdate', checked);
              }}
            />
          </div>
        </div>
      </SettingsSection>
    </motion.div>
  );
}