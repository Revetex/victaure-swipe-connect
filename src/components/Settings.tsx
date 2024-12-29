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
import { useTranslation } from "react-i18next";

export function Settings() {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem('language', value);
    toast.success(t('settings.success.language'));
  };

  const handleEmailNotifications = (checked: boolean) => {
    setEmailNotifications(checked);
    toast.success(
      t(checked 
        ? 'settings.success.notifications.email.enabled'
        : 'settings.success.notifications.email.disabled'
      )
    );
  };

  const handlePushNotifications = (checked: boolean) => {
    setPushNotifications(checked);
    toast.success(
      t(checked
        ? 'settings.success.notifications.push.enabled'
        : 'settings.success.notifications.push.disabled'
      )
    );
  };

  const handleThemeChange = (value: string) => {
    setTheme(value);
    toast.success(t('settings.success.theme'));
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(t('settings.error.logout'));
    } else {
      toast.success(t('settings.success.logout'));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('settings.general.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.general.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="language">{t('settings.general.language')}</Label>
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
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
            <Label htmlFor="theme">{t('settings.general.theme')}</Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionnez un thème" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <span className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    {t('settings.themes.light')}
                  </span>
                </SelectItem>
                <SelectItem value="dark">
                  <span className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    {t('settings.themes.dark')}
                  </span>
                </SelectItem>
                <SelectItem value="system">{t('settings.themes.system')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('settings.notifications.title')}
          </CardTitle>
          <CardDescription>
            {t('settings.notifications.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.email.title')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.notifications.email.description')}
              </p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={handleEmailNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.push.title')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.notifications.push.description')}
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
          {t('settings.logout')}
        </Button>
      </div>
    </div>
  );
}