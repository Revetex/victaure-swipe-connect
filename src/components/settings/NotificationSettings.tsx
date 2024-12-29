import { useState } from "react";
import { Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function NotificationSettings() {
  const { t } = useTranslation();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

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

  return (
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
  );
}