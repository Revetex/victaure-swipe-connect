import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      updateTheme(savedTheme);
    } else {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme("system");
      updateTheme(systemPreference);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        updateTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const updateTheme = (newTheme: Theme) => {
    if (newTheme === "dark" || (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  const setThemeWithUpdate = (newTheme: Theme) => {
    setTheme(newTheme);
    updateTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 bg-white/90 dark:bg-gray-800/90 shadow-md hover:shadow-lg transition-all duration-300"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5 text-orange-500 hover:text-orange-600 transition-colors" />
          ) : theme === "dark" ? (
            <Moon className="h-5 w-5 text-blue-400 hover:text-blue-500 transition-colors" />
          ) : (
            <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
        <DropdownMenuItem 
          onClick={() => setThemeWithUpdate("light")}
          className="hover:bg-orange-50 dark:hover:bg-gray-700/50"
        >
          <Sun className="mr-2 h-4 w-4 text-orange-500" />
          <span className="text-gray-700 dark:text-gray-200">Clair</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setThemeWithUpdate("dark")}
          className="hover:bg-blue-50 dark:hover:bg-gray-700/50"
        >
          <Moon className="mr-2 h-4 w-4 text-blue-400" />
          <span className="text-gray-700 dark:text-gray-200">Sombre</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setThemeWithUpdate("system")}
          className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <Monitor className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-200">Système</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}