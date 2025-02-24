
import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Bell, Lock, UserX, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Settings() {
  const { profile } = useProfile();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Déconnexion réussie");
      navigate("/auth");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const settingsItems = [
    {
      title: "Thème",
      icon: <Moon className="h-4 w-4" />,
      action: (
        <Switch 
          defaultChecked={false}
          onCheckedChange={() => {
            toast.success("Thème mis à jour");
          }}
        />
      )
    },
    {
      title: "Notifications",
      icon: <Bell className="h-4 w-4" />,
      action: (
        <Switch 
          defaultChecked={false}
          onCheckedChange={() => {
            toast.success("Préférences de notifications mises à jour");
          }}
        />
      )
    },
    {
      title: "Confidentialité",
      icon: <Lock className="h-4 w-4" />,
      action: (
        <Switch 
          defaultChecked={profile?.privacy_enabled ?? false}
          onCheckedChange={() => {
            toast.success("Paramètres de confidentialité mis à jour");
          }}
        />
      )
    },
    {
      title: "Utilisateurs bloqués",
      icon: <UserX className="h-4 w-4" />,
      action: (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            toast.success("Liste des utilisateurs bloqués mise à jour");
          }}
        >
          Gérer
        </Button>
      )
    },
    {
      title: "Déconnexion",
      icon: <LogOut className="h-4 w-4 text-destructive" />,
      action: (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-destructive hover:text-destructive/90"
          onClick={handleLogout}
        >
          Déconnexion
        </Button>
      )
    }
  ];

  return (
    <div className={cn(
      "min-h-[calc(100vh-4rem)]",
      "bg-background",
      isMobile ? "pt-4" : "pt-8"
    )}>
      <div className={cn(
        "container",
        "max-w-2xl",
        "mx-auto",
        "px-4",
        isMobile ? "pb-20" : "pb-8"
      )}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <h1 className="text-xl font-semibold tracking-tight">Paramètres</h1>
            <p className="text-sm text-muted-foreground">
              Gérez vos préférences et paramètres de compte.
            </p>
          </div>

          <Card className={cn(
            "divide-y divide-border",
            "shadow-sm",
            "backdrop-blur-sm",
            "bg-background/60"
          )}>
            {settingsItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "flex items-center justify-between",
                  "p-4",
                  isMobile && "py-3"
                )}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <Label className="font-medium cursor-pointer">
                    {item.title}
                  </Label>
                </div>
                {item.action}
              </motion.div>
            ))}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
