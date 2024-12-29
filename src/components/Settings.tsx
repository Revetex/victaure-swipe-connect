import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState("fr");

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast.success("Langue mise à jour avec succès");
  };

  const handleEmailNotifications = (checked: boolean) => {
    setEmailNotifications(checked);
    toast.success(
      checked
        ? "Notifications par email activées"
        : "Notifications par email désactivées"
    );
  };

  const handlePushNotifications = (checked: boolean) => {
    setPushNotifications(checked);
    toast.success(
      checked
        ? "Notifications push activées"
        : "Notifications push désactivées"
    );
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    toast.success("Thème mis à jour avec succès");
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      toast.success("Déconnexion réussie");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Paramètres généraux
          </CardTitle>
          <CardDescription>
            Configurez vos préférences générales d'utilisation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="language">Langue</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionnez une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Thème</Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionnez un thème" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <span className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Clair
                  </span>
                </SelectItem>
                <SelectItem value="dark">
                  <span className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Sombre
                  </span>
                </SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Gérez vos préférences de notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevez des mises à jour par email
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={handleEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications push</Label>
              <p className="text-sm text-muted-foreground">
                Recevez des notifications sur votre appareil
              </p>
            </div>
            <Switch
              checked={pushNotifications}
              onCheckedChange={handlePushNotifications}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="destructive"
          onClick={handleSignOut}
          className="w-full sm:w-auto"
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}