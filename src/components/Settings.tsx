import { LogOut, Bell, Moon, Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SettingsSection } from "./settings/SettingsSection";
import { Separator } from "./ui/separator";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Déconnexion réussie");
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Paramètres</h2>
      
      <div className="space-y-6">
        <SettingsSection title="Apparence">
          <div className="flex items-center justify-between space-x-4 hover:bg-muted p-2 rounded-lg transition-colors">
            <Label className="text-sm cursor-pointer flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Mode sombre
            </Label>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </div>
        </SettingsSection>

        <Separator />

        <SettingsSection title="Notifications">
          <div className="flex items-center justify-between space-x-4 hover:bg-muted p-2 rounded-lg transition-colors">
            <Label className="text-sm cursor-pointer flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications push
            </Label>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between space-x-4 hover:bg-muted p-2 rounded-lg transition-colors">
            <Label className="text-sm cursor-pointer flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Notifications email
            </Label>
            <Switch defaultChecked />
          </div>
        </SettingsSection>

        <Separator />

        <Button 
          variant="destructive" 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2"
        >
          <span>Déconnexion</span>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}