
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { SettingsSection } from "./SettingsSection";

export function PrivacySection() {
  const [privacyEnabled, setPrivacyEnabled] = useState(false);

  useEffect(() => {
    fetchPrivacySettings();
  }, []);

  const fetchPrivacySettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('privacy_enabled')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setPrivacyEnabled(profile?.privacy_enabled || false);
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      toast.error("Erreur lors du chargement des paramètres de confidentialité");
    }
  };

  const handlePrivacyToggle = async (checked: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ privacy_enabled: checked })
        .eq('id', user.id);

      if (error) throw error;

      setPrivacyEnabled(checked);
      toast.success(`Profil ${checked ? 'privé' : 'public'}`);
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast.error("Erreur lors de la mise à jour des paramètres de confidentialité");
    }
  };

  return (
    <SettingsSection title="Confidentialité">
      <div className={cn(
        "flex items-center justify-between p-4 rounded-lg",
        "bg-muted/5 hover:bg-muted/10 transition-colors",
        "dark:bg-muted/10 dark:hover:bg-muted/20",
        "border border-border/10",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      )}>
        <Label className="text-sm cursor-pointer flex items-center gap-2">
          {privacyEnabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          Profil privé
        </Label>
        <Switch 
          checked={privacyEnabled}
          onCheckedChange={handlePrivacyToggle}
        />
      </div>
    </SettingsSection>
  );
}
