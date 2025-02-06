
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
    <Button 
      variant="destructive" 
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={cn(
        "w-full flex items-center justify-center gap-2",
        "bg-destructive hover:bg-destructive/90",
        "text-destructive-foreground font-medium",
        "transition-colors duration-200",
        "border border-destructive/20",
        isLoggingOut && "opacity-70 cursor-not-allowed"
      )}
    >
      <span>{isLoggingOut ? "Déconnexion en cours..." : "Déconnexion"}</span>
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
