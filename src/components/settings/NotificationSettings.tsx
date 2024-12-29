import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function NotificationSettings() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.notifications.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications">
            {t("settings.notifications.email")}
          </Label>
          <Switch id="email-notifications" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="push-notifications">
            {t("settings.notifications.push")}
          </Label>
          <Switch id="push-notifications" />
        </div>
      </CardContent>
    </Card>
  );
}