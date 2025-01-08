import { Shield, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";
import { SettingsSection } from "./SettingsSection";
import { PasswordChangeSection } from "./PasswordChangeSection";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export function SecuritySection() {
  const [showSensitiveData, setShowSensitiveData] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const toggleTwoFactor = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({ two_factor_enabled: !twoFactorEnabled })
        .eq('id', user.id);

      if (error) throw error;

      setTwoFactorEnabled(!twoFactorEnabled);
      toast.success(`Authentification à deux facteurs ${!twoFactorEnabled ? 'activée' : 'désactivée'}`);
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      toast.error("Erreur lors de la modification de l'authentification à deux facteurs");
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <SettingsSection title="Sécurité">
        <div className="space-y-4">
          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            "hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          )}>
            <Label className="text-sm cursor-pointer flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Authentification à deux facteurs
            </Label>
            <Switch 
              checked={twoFactorEnabled}
              onCheckedChange={toggleTwoFactor}
            />
          </div>

          <div className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            "hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          )}>
            <Label className="text-sm cursor-pointer flex items-center gap-2">
              {showSensitiveData ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Afficher les données sensibles
            </Label>
            <Switch 
              checked={showSensitiveData}
              onCheckedChange={setShowSensitiveData}
            />
          </div>

          <PasswordChangeSection />
        </div>
      </SettingsSection>
    </motion.div>
  );
}