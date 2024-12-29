import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function LogoutButton() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success(t("auth.logoutSuccess"));
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error(t("auth.logoutError"));
    }
  };

  return (
    <Button
      variant="destructive"
      className="w-full"
      onClick={handleLogout}
    >
      <LogOut className="mr-2 h-4 w-4" />
      {t("auth.logout")}
    </Button>
  );
}