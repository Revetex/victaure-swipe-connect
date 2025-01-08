import { Moon, Sun, Monitor } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { itemVariants } from "./animations";
import { SettingsSection } from "./SettingsSection";

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div variants={itemVariants}>
      <SettingsSection title="Apparence">
        <div className={cn(
          "p-3 rounded-lg",
          "hover:bg-muted/50 dark:hover:bg-muted/25 transition-colors",
          "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        )}>
          <Label className="text-sm mb-4 flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Thème
          </Label>
          <RadioGroup
            value={theme}
            onValueChange={(value) => {
              setTheme(value);
              toast.success(`Thème ${value === 'light' ? 'clair' : value === 'dark' ? 'sombre' : 'système'} activé`);
            }}
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
      </SettingsSection>
    </motion.div>
  );
}