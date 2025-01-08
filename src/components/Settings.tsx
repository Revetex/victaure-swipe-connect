import { LogOut, Bell, Moon, Lock, Sun, Monitor, Shield, Globe, Eye, EyeOff, Smartphone, Laptop } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
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
  const [isLoading, setIsLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [devicePreferences, setDevicePreferences] = useState({
    enableNotifications: true,
    enableLocationServices: false,
    enableAutoUpdate: true
  });
  const { signOut } = useAuth();

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        // Fetch user settings from Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile) {
            // Initialize settings from profile
            setDevicePreferences({
              enableNotifications: profile.notifications_enabled ?? true,
              enableLocationServices: profile.location_enabled ?? false,
              enableAutoUpdate: profile.auto_update_enabled ?? true
            });
            setTwoFactorEnabled(profile.two_factor_enabled ?? false);
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Erreur lors du chargement des paramètres");
      } finally {
        setIsLoading(false);
        setMounted(true);
      }
    };

    initializeSettings();
  }, []);

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

  const updateDevicePreference = async (key: keyof typeof devicePreferences, value: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const updates = { [key.toLowerCase()]: value };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setDevicePreferences(prev => ({ ...prev, [key]: value }));
      toast.success("Préférences mises à jour");
    } catch (error) {
      console.error("Error updating preference:", error);
      toast.error("Erreur lors de la mise à jour des préférences");
    }
  };

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

  if (!mounted) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-full overflow-y-auto"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-2xl font-semibold tracking-tight"
      >
        Paramètres
      </motion.h2>
      
      <div className="space-y-6">
        <motion.div variants={itemVariants}>
          <SettingsSection title="Apparence">
            <div className={cn(
              "p-3 rounded-lg",
              "hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            )}>
              <Label className="text-sm mb-4 flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Thème
              </Label>
              <RadioGroup
                value={theme}
                onValueChange={(value) => {
                  setTheme(value);
                  toast.success(`Thème ${value === 'light' ? 'clair' : value === 'dark' ? 'sombre' : 'système'} activé`);
                }}
                className="grid gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light" className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Clair
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark" className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Sombre
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system" className="flex items-center gap-2">
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

              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <h3 className="text-sm font-medium">Mot de passe</h3>
              </div>
              <PasswordChangeSection />
            </div>
          </SettingsSection>
        </motion.div>

        <Separator className="my-4" />

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

        <Separator className="my-4" />

        <motion.div variants={itemVariants}>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "w-full flex items-center justify-center gap-2",
              "transition-all duration-200",
              "hover:bg-destructive/90",
              "focus:ring-2 focus:ring-destructive focus:ring-offset-2",
              isLoggingOut && "opacity-70 cursor-not-allowed"
            )}
          >
            <span>{isLoggingOut ? "Déconnexion en cours..." : "Déconnexion"}</span>
            <LogOut className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}