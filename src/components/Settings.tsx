import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Bell, Lock, UserX, LogOut } from "lucide-react";

export default function Settings() {
  const { profile } = useProfile();

  const settingsItems = [
    {
      title: "Thème",
      icon: profile?.theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />,
      action: (
        <Switch 
          checked={profile?.theme === "dark"}
          onCheckedChange={() => {
            // Implémentation du changement de thème
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
          checked={profile?.notifications_enabled}
          onCheckedChange={() => {
            // Implémentation des notifications
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
          checked={profile?.privacy_enabled}
          onCheckedChange={() => {
            // Implémentation de la confidentialité
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
            // Implémentation de la gestion des utilisateurs bloqués
            toast.success("Liste des utilisateurs bloqués mise à jour");
          }}
        >
          Gérer
        </Button>
      )
    },
    {
      title: "Déconnexion",
      icon: <LogOut className="h-4 w-4" className="text-destructive" />,
      action: (
        <Button 
          variant="ghost" 
          size="sm"
          className="text-destructive hover:text-destructive/90"
          onClick={() => {
            // Implémentation de la déconnexion
            toast.success("Déconnexion en cours...");
          }}
        >
          Déconnexion
        </Button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto p-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Paramètres</h1>
            <p className="text-sm text-muted-foreground">
              Gérez vos préférences et paramètres de compte.
            </p>
          </div>

          <Card className="divide-y divide-border">
            {settingsItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <Label className="font-medium">{item.title}</Label>
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
