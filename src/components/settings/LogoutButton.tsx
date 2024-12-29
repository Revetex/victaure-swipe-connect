import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function LogoutButton() {
  const { t } = useTranslation();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(t('settings.error.logout'));
    } else {
      toast.success(t('settings.success.logout'));
    }
  };

  return (
    <div className="flex justify-end">
      <Button
        variant="destructive"
        onClick={handleSignOut}
        className="w-full sm:w-auto"
      >
        {t('settings.logout')}
      </Button>
    </div>
  );
}