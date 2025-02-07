
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { SettingsSection } from "./SettingsSection";

export function LogoutSection() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useAuth();

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

  return (
    <SettingsSection title="Déconnexion">
      <Button 
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full justify-start gap-2 px-2 h-9 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
      >
        <LogOut className="h-4 w-4" />
        <span className="text-sm">
          {isLoggingOut ? "Déconnexion en cours..." : "Déconnexion"}
        </span>
      </Button>
    </SettingsSection>
  );
}
