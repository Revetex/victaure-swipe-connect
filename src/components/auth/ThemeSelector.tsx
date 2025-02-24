
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-xl border-2 border-primary/20 bg-background/50 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300"
        onClick={toggleTheme}
        title={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}
        aria-label={theme === "dark" ? "Passer au mode clair" : "Passer au mode sombre"}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    </div>
  );
}
