import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.notifications")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notif">{t("settings.emailNotifications")}</Label>
          <Switch id="email-notif" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notif">{t("settings.pushNotifications")}</Label>
          <Switch id="push-notif" />
        </div>
      </CardContent>
    </Card>
  );
}