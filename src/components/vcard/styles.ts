import { StyleOption } from "./types";

export const styleOptions: StyleOption[] = [
  {
    id: "1",
    name: "Classique",
    color: "#1E40AF",
    font: "'Poppins', sans-serif",
    displayStyle: "default",
    bgGradient: "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900/80 dark:via-blue-800/80 dark:to-blue-700/80",
    secondaryColor: "#60A5FA",
    accentGradient: "bg-gradient-to-br from-blue-500/10 to-blue-600/10",
    borderStyle: "border-b-4 border-blue-500/30",
    colors: {
      primary: "#1E3A8A",
      secondary: "#3B82F6",
      text: {
        primary: "#1E293B",
        secondary: "#334155",
        muted: "#64748B"
      },
      background: {
        card: "bg-white dark:bg-gray-900",
        section: "bg-blue-50/50 dark:bg-blue-900/20",
        button: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      }
    }
  },
  {
    id: "2",
    name: "Chaleureux",
    color: "#D97706",
    font: "'Montserrat', sans-serif",
    displayStyle: "warm",
    bgGradient: "bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 dark:from-amber-900/80 dark:via-orange-800/80 dark:to-amber-700/80",
    secondaryColor: "#FBBF24",
    accentGradient: "bg-gradient-to-br from-amber-500/10 to-orange-500/10",
    borderStyle: "border-l-4 border-amber-500/30",
    colors: {
      primary: "#92400E",
      secondary: "#F59E0B",
      text: {
        primary: "#78350F",
        secondary: "#92400E",
        muted: "#B45309"
      },
      background: {
        card: "bg-amber-50 dark:bg-amber-900/90",
        section: "bg-amber-100/50 dark:bg-amber-800/30",
        button: "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
      }
    }
  },
  {
    id: "3",
    name: "Moderne",
    color: "#059669",
    font: "'Inter', sans-serif",
    displayStyle: "modern",
    bgGradient: "bg-gradient-to-br from-emerald-50 via-teal-100 to-emerald-200 dark:from-emerald-900/80 dark:via-teal-800/80 dark:to-emerald-700/80",
    secondaryColor: "#10B981",
    accentGradient: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
    borderStyle: "border-t-4 border-emerald-500/30",
    colors: {
      primary: "#065F46",
      secondary: "#10B981",
      text: {
        primary: "#064E3B",
        secondary: "#065F46",
        muted: "#047857"
      },
      background: {
        card: "bg-emerald-50 dark:bg-emerald-900/90",
        section: "bg-emerald-100/50 dark:bg-emerald-800/30",
        button: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
      }
    }
  },
  {
    id: "4",
    name: "Élégant",
    color: "#8B5CF6",
    font: "'Playfair Display', serif",
    displayStyle: "elegant",
    bgGradient: "bg-gradient-to-br from-violet-50 via-purple-100 to-violet-200 dark:from-violet-900/80 dark:via-purple-800/80 dark:to-violet-700/80",
    secondaryColor: "#A78BFA",
    accentGradient: "bg-gradient-to-br from-violet-500/10 to-purple-500/10",
    borderStyle: "rounded-xl shadow-xl border-violet-500/30",
    colors: {
      primary: "#6D28D9",
      secondary: "#8B5CF6",
      text: {
        primary: "#4C1D95",
        secondary: "#5B21B6",
        muted: "#6D28D9"
      },
      background: {
        card: "bg-violet-50 dark:bg-violet-900/90",
        section: "bg-violet-100/50 dark:bg-violet-800/30",
        button: "bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
      }
    }
  },
  {
    id: "5",
    name: "Audacieux",
    color: "#DB2777",
    font: "'Oswald', sans-serif",
    displayStyle: "bold",
    bgGradient: "bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 dark:from-pink-900/80 dark:via-rose-800/80 dark:to-pink-700/80",
    secondaryColor: "#EC4899",
    accentGradient: "bg-gradient-to-br from-pink-500/10 to-rose-500/10",
    borderStyle: "border-x-4 border-pink-500/30",
    colors: {
      primary: "#BE185D",
      secondary: "#EC4899",
      text: {
        primary: "#831843",
        secondary: "#9D174D",
        muted: "#BE185D"
      },
      background: {
        card: "bg-pink-50 dark:bg-pink-900/90",
        section: "bg-pink-100/50 dark:bg-pink-800/30",
        button: "bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600"
      }
    }
  }
];