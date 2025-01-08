import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Separator } from "./ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { containerVariants } from "./settings/animations";
import { AppearanceSection } from "./settings/AppearanceSection";
import { SecuritySection } from "./settings/SecuritySection";
import { DevicePreferencesSection } from "./settings/DevicePreferencesSection";

export function Settings() {
  const [mounted, setMounted] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        setIsLoading(false);
        setMounted(true);
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast.error("Erreur lors du chargement des paramètres");
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
        className="text-2xl font-semibold tracking-tight"
      >
        Paramètres
      </motion.h2>
      
      <div className="space-y-6">
        <AppearanceSection />

        <Separator className="my-4" />

        <SecuritySection />

        <Separator className="my-4" />

        <DevicePreferencesSection />

        <Separator className="my-4" />

        <motion.div>
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