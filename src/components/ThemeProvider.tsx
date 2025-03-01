
"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useState, useEffect, createContext, useContext } from "react";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  themeStyle: string;
  setThemeStyle: (style: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  themeColor: "#64B5D9",
  setThemeColor: () => {},
  themeStyle: "modern",
  setThemeStyle: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);
  const [themeColor, setThemeColor] = useState("#64B5D9");
  const [themeStyle, setThemeStyle] = useState("modern");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Vérification des préférences utilisateur
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");
    const savedColor = localStorage.getItem("themeColor");
    const savedStyle = localStorage.getItem("themeStyle");
    
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(darkModePreference);
    }
    
    if (savedColor) {
      setThemeColor(savedColor);
    }
    
    if (savedStyle) {
      setThemeStyle(savedStyle);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  const handleSetThemeColor = (color: string) => {
    setThemeColor(color);
    localStorage.setItem("themeColor", color);
    document.documentElement.style.setProperty('--primary-color', color);
  };

  const handleSetThemeStyle = (style: string) => {
    setThemeStyle(style);
    localStorage.setItem("themeStyle", style);
    
    // Appliquer la classe de style au document
    document.documentElement.classList.remove("theme-modern", "theme-elegant", "theme-dark", "theme-professional");
    document.documentElement.classList.add(`theme-${style}`);
  };

  // Appliquer les classes de thème au document
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.setProperty('--primary-color', themeColor);
      
      // Appliquer le style de thème
      document.documentElement.classList.remove("theme-modern", "theme-elegant", "theme-dark", "theme-professional");
      document.documentElement.classList.add(`theme-${themeStyle}`);
    }
  }, [isDark, themeColor, themeStyle, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider 
      value={{ 
        isDark, 
        toggleTheme, 
        themeColor, 
        setThemeColor: handleSetThemeColor,
        themeStyle,
        setThemeStyle: handleSetThemeStyle
      }}
    >
      <NextThemeProvider
        attribute="class"
        defaultTheme={isDark ? "dark" : "light"}
        enableSystem
        {...props}
      >
        {children}
      </NextThemeProvider>
    </ThemeContext.Provider>
  );
}
