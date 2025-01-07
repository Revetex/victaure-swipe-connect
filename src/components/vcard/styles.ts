import { StyleOption } from "./types";

export const styleOptions: StyleOption[] = [
  {
    id: "1",
    name: "Classique",
    color: "#1E40AF",
    font: "poppins",
    displayStyle: "default",
    bgGradient: "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900/80 dark:via-blue-800/80 dark:to-blue-700/80",
    secondaryColor: "#60A5FA",
    accentGradient: "bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-500/10",
    borderStyle: "border-b-4 border-blue-500/30",
    colors: {
      primary: "#1E3A8A",
      secondary: "#3B82F6",
      text: {
        primary: "#1E293B",
        secondary: "#334155",
        muted: "#64748B"
      }
    }
  },
  {
    id: "2",
    name: "Chaleureux",
    color: "#D97706",
    font: "montserrat",
    displayStyle: "warm",
    bgGradient: "bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 dark:from-amber-900/80 dark:via-orange-800/80 dark:to-amber-700/80",
    secondaryColor: "#FBBF24",
    accentGradient: "bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-400/10 dark:to-orange-400/10",
    borderStyle: "border-l-4 border-amber-500/30",
    colors: {
      primary: "#92400E",
      secondary: "#F59E0B",
      text: {
        primary: "#78350F",
        secondary: "#92400E",
        muted: "#B45309"
      }
    }
  },
  {
    id: "3",
    name: "Moderne",
    color: "#059669",
    font: "roboto",
    displayStyle: "modern",
    bgGradient: "bg-gradient-to-br from-emerald-50 via-teal-100 to-emerald-200 dark:from-emerald-900/80 dark:via-teal-800/80 dark:to-emerald-700/80",
    secondaryColor: "#10B981",
    accentGradient: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10",
    borderStyle: "border-t-4 border-emerald-500/30",
    colors: {
      primary: "#065F46",
      secondary: "#10B981",
      text: {
        primary: "#064E3B",
        secondary: "#065F46",
        muted: "#047857"
      }
    }
  },
  {
    id: "4",
    name: "Élégant",
    color: "#8B5CF6",
    font: "playfair",
    displayStyle: "elegant",
    bgGradient: "bg-gradient-to-br from-violet-50 via-purple-100 to-violet-200 dark:from-violet-900/80 dark:via-purple-800/80 dark:to-violet-700/80",
    secondaryColor: "#A78BFA",
    accentGradient: "bg-gradient-to-br from-violet-500/10 to-purple-500/10 dark:from-violet-400/10 dark:to-purple-400/10",
    borderStyle: "rounded-xl shadow-xl border-violet-500/30",
    colors: {
      primary: "#6D28D9",
      secondary: "#8B5CF6",
      text: {
        primary: "#4C1D95",
        secondary: "#5B21B6",
        muted: "#6D28D9"
      }
    }
  },
  {
    id: "5",
    name: "Audacieux",
    color: "#DB2777",
    font: "opensans",
    displayStyle: "bold",
    bgGradient: "bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 dark:from-pink-900/80 dark:via-rose-800/80 dark:to-pink-700/80",
    secondaryColor: "#EC4899",
    accentGradient: "bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-400/10 dark:to-rose-400/10",
    borderStyle: "border-x-4 border-pink-500/30",
    colors: {
      primary: "#BE185D",
      secondary: "#EC4899",
      text: {
        primary: "#831843",
        secondary: "#9D174D",
        muted: "#BE185D"
      }
    }
  },
  {
    id: "6",
    name: "Minimaliste",
    color: "#4B5563",
    font: "inter",
    displayStyle: "minimal",
    bgGradient: "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-700/80",
    secondaryColor: "#6B7280",
    accentGradient: "bg-gradient-to-br from-gray-500/10 to-gray-600/10 dark:from-gray-400/10 dark:to-gray-500/10",
    borderStyle: "border-2 border-gray-500/30",
    colors: {
      primary: "#374151",
      secondary: "#6B7280",
      text: {
        primary: "#111827",
        secondary: "#1F2937",
        muted: "#374151"
      }
    }
  },
  {
    id: "7",
    name: "Créatif",
    color: "#EA580C",
    font: "quicksand",
    displayStyle: "creative",
    bgGradient: "bg-gradient-to-br from-orange-50 via-yellow-100 to-orange-200 dark:from-orange-900/80 dark:via-yellow-800/80 dark:to-orange-700/80",
    secondaryColor: "#F97316",
    accentGradient: "bg-gradient-to-br from-orange-500/10 to-yellow-500/10 dark:from-orange-400/10 dark:to-yellow-400/10",
    borderStyle: "rounded-3xl shadow-2xl border-orange-500/30",
    colors: {
      primary: "#C2410C",
      secondary: "#F97316",
      text: {
        primary: "#7C2D12",
        secondary: "#9A3412",
        muted: "#C2410C"
      }
    }
  },
  {
    id: "8",
    name: "Professionnel",
    color: "#0369A1",
    font: "lato",
    displayStyle: "professional",
    bgGradient: "bg-gradient-to-br from-sky-50 via-blue-100 to-sky-200 dark:from-sky-900/80 dark:via-blue-800/80 dark:to-sky-700/80",
    secondaryColor: "#0EA5E9",
    accentGradient: "bg-gradient-to-br from-sky-500/10 to-blue-500/10 dark:from-sky-400/10 dark:to-blue-400/10",
    borderStyle: "border-r-4 border-sky-500/30",
    colors: {
      primary: "#075985",
      secondary: "#0EA5E9",
      text: {
        primary: "#0C4A6E",
        secondary: "#075985",
        muted: "#0369A1"
      }
    }
  }
];