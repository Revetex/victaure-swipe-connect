
import { Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-between px-2 h-9"
      asChild
    >
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          {privacyEnabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="text-sm">Profil privé</span>
        </div>
        <Switch 
          checked={privacyEnabled}
          onCheckedChange={handlePrivacyToggle}
          aria-label="Activer ou désactiver le mode privé"
        />
      </div>
    </Button>
  );
}
