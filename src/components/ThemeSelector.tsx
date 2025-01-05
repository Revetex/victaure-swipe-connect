import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-3 rounded-lg">
      <Label className="text-sm mb-4 flex items-center gap-2">
        <Moon className="h-4 w-4" />
        Thème
      </Label>
      <RadioGroup
        value={theme}
        onValueChange={setTheme}
        className="grid gap-4 mt-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="light" id="light" />
          <Label htmlFor="light" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Clair
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="dark" id="dark" />
          <Label htmlFor="dark" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Sombre
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="system" id="system" />
          <Label htmlFor="system" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Système
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}