
import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useThemeContext } from "@/components/ThemeProvider";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ThemeSelector() {
  const { isDark, toggleTheme, themeColor, setThemeColor } = useThemeContext();
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const colorOptions = [
    "#64B5D9", // Bleu (défaut)
    "#9b87f5", // Violet
    "#F564A9", // Rose
    "#56c964", // Vert
    "#f5a742", // Orange
    "#e74c3c", // Rouge
  ];
  
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-background/80"
          >
            <Palette className="h-5 w-5 text-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="grid grid-cols-3 gap-1 p-2 w-auto">
          {colorOptions.map((color) => (
            <div
              key={color}
              className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: color }}
              onClick={() => setThemeColor(color)}
            >
              {themeColor === color && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 rounded-full bg-white"
                />
              )}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleTheme}
        className="bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-background/80"
      >
        <motion.div
          animate={{ rotate: isDark ? 0 : 180 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-foreground" />
          ) : (
            <Sun className="h-5 w-5 text-foreground" />
          )}
        </motion.div>
      </Button>
    </div>
  );
}
