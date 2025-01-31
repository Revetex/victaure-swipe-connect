import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="absolute top-4 right-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : theme === "system" ? (
              <Monitor className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={() => setTheme("light")} className="text-xs">
            <Sun className="mr-2 h-3 w-3" />
            <span>Clair</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="text-xs">
            <Moon className="mr-2 h-3 w-3" />
            <span>Sombre</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="text-xs">
            <Monitor className="mr-2 h-3 w-3" />
            <span>Système</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};