import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react";
import { Label } from "@/components/ui/label";
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
    toast.success(t('settings.success.theme'));
  };

  return (
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
  );
}