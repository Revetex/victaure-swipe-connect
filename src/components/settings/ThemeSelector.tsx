import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Moon, Sun, Monitor } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const handleThemeChange = (value: string) => {
    setTheme(value);
    toast.success(t("settings.success.theme"));
  };

  return (
    <Select value={theme} onValueChange={handleThemeChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t("settings.theme")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>{t("settings.themes.light")}</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>{t("settings.themes.dark")}</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>{t("settings.themes.system")}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}