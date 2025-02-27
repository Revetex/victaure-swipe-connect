
"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { useState, useEffect, createContext, useContext } from "react";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  themeColor: "#64B5D9",
  setThemeColor: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(false);
  const [themeColor, setThemeColor] = useState("#64B5D9");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check user preference
    const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const savedTheme = localStorage.getItem("theme");
    const savedColor = localStorage.getItem("themeColor");
    
    if (savedTheme) {
      setIsDark(savedTheme === "dark");
    } else {
      setIsDark(darkModePreference);
    }
    
    if (savedColor) {
      setThemeColor(savedColor);
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

  // Apply theme class to document
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle("dark", isDark);
      document.documentElement.style.setProperty('--primary-color', themeColor);
    }
  }, [isDark, themeColor, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, themeColor, setThemeColor: handleSetThemeColor }}>
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
