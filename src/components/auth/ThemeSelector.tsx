import { Button } from "@/components/ui/button";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useThemeContext } from "@/components/ThemeProvider";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export function ThemeSelector() {
  const {
    isDark,
    toggleTheme,
    themeColor,
    setThemeColor
  } = useThemeContext();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorOptions = ["#64B5D9",
  // Bleu (défaut)
  "#9b87f5",
  // Violet
  "#F564A9",
  // Rose
  "#56c964",
  // Vert
  "#f5a742",
  // Orange
  "#e74c3c" // Rouge
  ];
  return;
}