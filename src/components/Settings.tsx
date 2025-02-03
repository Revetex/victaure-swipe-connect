import { LogOut, Bell, Moon, Lock, Sun, Monitor, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SettingsSection } from "./settings/SettingsSection";
import { Separator } from "./ui/separator";
import { PasswordChangeSection } from "./settings/PasswordChangeSection";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { BlockedUsersSection } from "./settings/BlockedUsersSection";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const { signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-4 sm:p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border border-border/50 shadow-lg h-full overflow-y-auto"
    >
      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <SettingsSection title="Apparence">
            <div className={cn(
              "p-4 rounded-lg bg-muted/30",
              "hover:bg-muted/50 dark:hover:bg-muted/40 transition-colors",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            )}>
              <Label className="text-sm mb-4 flex items-center gap-2 text-foreground/80">
                <Moon className="h-4 w-4" />
                Thème
              </Label>
              <RadioGroup
                value={theme}
                onValueChange={(value) => {
                  setTheme(value);
                  toast.success(`Thème ${value === 'light' ? 'clair' : value === 'dark' ? 'sombre' : 'système'} activé`);
                }}
                className="grid gap-3 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-2 text-sm cursor-pointer">
                    <Sun className="h-4 w-4" />
                    Clair
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-2 text-sm cursor-pointer">
                    <Moon className="h-4 w-4" />
                    Sombre
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="flex items-center gap-2 text-sm cursor-pointer">
                    <Monitor className="h-4 w-4" />
                    Système
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </SettingsSection>
        </motion.div>

        <Separator className="my-4" />

        <motion.div variants={itemVariants}>
          <SettingsSection title="Confidentialité">
            <div className={cn(
              "flex items-center justify-between p-3 rounded-lg bg-muted/30",
              "hover:bg-muted/50 dark:hover:bg-muted/40 transition-colors",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            )}>
              <Label className="text-sm cursor-pointer flex items-center gap-2 text-foreground/80">
                {privacyEnabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                Profil privé
              </Label>
              <Switch 
                checked={privacyEnabled}
                onCheckedChange={handlePrivacyToggle}
              />
            </div>
          </SettingsSection>
        </motion.div>

        <Separator className="my-4" />

        <motion.div variants={itemVariants}>
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
        </motion.div>

        <Separator className="my-4" />

        <motion.div variants={itemVariants}>
          <SettingsSection title="Sécurité">
            <div className="space-y-3 p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 text-foreground/80">
                <Lock className="h-4 w-4" />
                <h3 className="text-sm font-medium">Mot de passe</h3>
              </div>
              <PasswordChangeSection />
            </div>
          </SettingsSection>
        </motion.div>

        <Separator className="my-4" />

        <motion.div variants={itemVariants}>
          <SettingsSection title="Utilisateurs bloqués">
            <div className="p-3 rounded-lg bg-muted/30">
              <BlockedUsersSection />
            </div>
          </SettingsSection>
        </motion.div>

        <Separator className="my-4" />

        <motion.div variants={itemVariants}>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "w-full flex items-center justify-center gap-2 h-9",
              "bg-destructive/80 hover:bg-destructive",
              "text-destructive-foreground font-medium text-sm",
              "transition-all duration-200",
              "shadow-sm hover:shadow",
              "rounded-lg",
              "border border-destructive/20",
              "focus:ring-2 focus:ring-destructive/30 focus:ring-offset-1",
              isLoggingOut && "opacity-70 cursor-not-allowed"
            )}
          >
            <span>{isLoggingOut ? "Déconnexion en cours..." : "Déconnexion"}</span>
            <LogOut className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
