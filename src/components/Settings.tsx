import { LogOut, Bell, Moon, Lock } from "lucide-react";
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
  const { signOut } = useAuth();

  useEffect(() => {
    setMounted(true);
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

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
              "flex items-center justify-between space-x-4 p-3 rounded-lg",
              "hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            )}>
              <Label className="text-sm cursor-pointer flex items-center gap-2">
                <Moon className="h-4 w-4" />
                Mode sombre
              </Label>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light");
                  toast.success(`Mode ${checked ? "sombre" : "clair"} activé`);
                }}
              />
            </div>
          </SettingsSection>
        </motion.div>

        <Separator className="my-4" />

        <motion.div variants={itemVariants}>
          <SettingsSection title="Notifications">
            <div className={cn(
              "flex items-center justify-between space-x-4 p-3 rounded-lg",
              "hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors",
              "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            )}>
              <Label className="text-sm cursor-pointer flex items-center gap-2">
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
            <div className="space-y-4">
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