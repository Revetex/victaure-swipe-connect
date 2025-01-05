import { StyleOption } from "./types";

export const styleOptions: StyleOption[] = [
  {
    id: "1",
    name: "Classique",
    color: "#1E40AF",
    font: "poppins",
    displayStyle: "default",
    bgGradient: "from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800",
    secondaryColor: "#60A5FA",
    accentGradient: "linear-gradient(135deg, rgba(96, 165, 250, 0.3), rgba(30, 64, 175, 0.3))",
    borderStyle: "border-b-4 border-blue-500/30",
    colors: {
      primary: "#1E40AF",
      secondary: "#60A5FA",
      text: {
        primary: "#1E293B",
        secondary: "#475569",
        muted: "#64748B"
      }
    }
  },
  {
    id: "2",
    name: "Chaleureux",
    color: "#F59E0B",
    font: "montserrat",
    displayStyle: "warm",
    bgGradient: "from-amber-50 to-orange-100 dark:from-amber-900 dark:to-orange-800",
    secondaryColor: "#FCD34D",
    accentGradient: "linear-gradient(135deg, rgba(252, 211, 77, 0.3), rgba(245, 158, 11, 0.3))",
    borderStyle: "border-l-4 border-amber-500/30",
    colors: {
      primary: "#F59E0B",
      secondary: "#FCD34D",
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
    color: "#10B981",
    font: "roboto",
    displayStyle: "modern",
    bgGradient: "from-emerald-50 to-teal-100 dark:from-emerald-900 dark:to-teal-800",
    secondaryColor: "#34D399",
    accentGradient: "linear-gradient(135deg, rgba(52, 211, 153, 0.3), rgba(16, 185, 129, 0.3))",
    borderStyle: "border-t-4 border-emerald-500/30",
    colors: {
      primary: "#10B981",
      secondary: "#34D399",
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
    bgGradient: "from-violet-50 to-purple-100 dark:from-violet-900 dark:to-purple-800",
    secondaryColor: "#A78BFA",
    accentGradient: "linear-gradient(135deg, rgba(167, 139, 250, 0.3), rgba(139, 92, 246, 0.3))",
    borderStyle: "rounded-xl shadow-xl border-violet-500/30",
    colors: {
      primary: "#8B5CF6",
      secondary: "#A78BFA",
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
    color: "#EC4899",
    font: "opensans",
    displayStyle: "bold",
    bgGradient: "from-pink-50 to-rose-100 dark:from-pink-900 dark:to-rose-800",
    secondaryColor: "#F472B6",
    accentGradient: "linear-gradient(135deg, rgba(244, 114, 182, 0.3), rgba(236, 72, 153, 0.3))",
    borderStyle: "border-x-4 border-pink-500/30",
    colors: {
      primary: "#EC4899",
      secondary: "#F472B6",
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
    color: "#6B7280",
    font: "inter",
    displayStyle: "minimal",
    bgGradient: "from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
    secondaryColor: "#9CA3AF",
    accentGradient: "linear-gradient(135deg, rgba(156, 163, 175, 0.3), rgba(107, 114, 128, 0.3))",
    borderStyle: "border-2 border-gray-500/30",
    colors: {
      primary: "#6B7280",
      secondary: "#9CA3AF",
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
    color: "#F97316",
    font: "quicksand",
    displayStyle: "creative",
    bgGradient: "from-orange-50 to-yellow-100 dark:from-orange-900 dark:to-yellow-800",
    secondaryColor: "#FB923C",
    accentGradient: "linear-gradient(135deg, rgba(251, 146, 60, 0.3), rgba(249, 115, 22, 0.3))",
    borderStyle: "rounded-3xl shadow-2xl border-orange-500/30",
    colors: {
      primary: "#F97316",
      secondary: "#FB923C",
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
    color: "#0284C7",
    font: "lato",
    displayStyle: "professional",
    bgGradient: "from-sky-50 to-blue-100 dark:from-sky-900 dark:to-blue-800",
    secondaryColor: "#38BDF8",
    accentGradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.3), rgba(2, 132, 199, 0.3))",
    borderStyle: "border-r-4 border-sky-500/30",
    colors: {
      primary: "#0284C7",
      secondary: "#38BDF8",
      text: {
        primary: "#0C4A6E",
        secondary: "#075985",
        muted: "#0369A1"
      }
    }
  }
];