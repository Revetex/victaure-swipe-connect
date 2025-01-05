import { StyleOption } from './types';

export const styleOptions: StyleOption[] = [
  {
    id: "1",
    name: "Moderne",
    color: "#3B82F6",
    secondaryColor: "#60A5FA",
    font: "'Inter', sans-serif",
    bgGradient: "bg-gradient-to-br from-blue-500 to-purple-600",
    borderStyle: "border-blue-500/20",
    colors: {
      primary: "#3B82F6",
      secondary: "#60A5FA",
      text: {
        primary: "#FFFFFF",
        secondary: "rgba(255, 255, 255, 0.9)",
        muted: "rgba(255, 255, 255, 0.7)"
      }
    }
  },
  {
    id: "2",
    name: "Classique",
    color: "#4B5563",
    secondaryColor: "#6B7280",
    font: "'Georgia', serif",
    bgGradient: "bg-gradient-to-br from-gray-700 to-gray-900",
    borderStyle: "border-gray-600/20",
    colors: {
      primary: "#4B5563",
      secondary: "#6B7280",
      text: {
        primary: "#FFFFFF",
        secondary: "rgba(255, 255, 255, 0.9)",
        muted: "rgba(255, 255, 255, 0.7)"
      }
    }
  },
  {
    id: "3",
    name: "Minimaliste",
    color: "#111827",
    secondaryColor: "#1F2937",
    font: "'Helvetica', sans-serif",
    bgGradient: "bg-white dark:bg-gray-900",
    borderStyle: "border-gray-200 dark:border-gray-800",
    colors: {
      primary: "#111827",
      secondary: "#1F2937",
      text: {
        primary: "#111827",
        secondary: "#374151",
        muted: "#6B7280"
      }
    }
  },
  {
    id: "4",
    name: "Créatif",
    color: "#EC4899",
    secondaryColor: "#F472B6",
    font: "'Poppins', sans-serif",
    bgGradient: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
    borderStyle: "border-pink-500/20",
    colors: {
      primary: "#EC4899",
      secondary: "#F472B6",
      text: {
        primary: "#FFFFFF",
        secondary: "rgba(255, 255, 255, 0.9)",
        muted: "rgba(255, 255, 255, 0.7)"
      }
    }
  },
  {
    id: "5",
    name: "Professionnel",
    color: "#1E40AF",
    secondaryColor: "#3B82F6",
    font: "'Arial', sans-serif",
    bgGradient: "bg-gradient-to-br from-blue-900 to-blue-700",
    borderStyle: "border-blue-800/20",
    colors: {
      primary: "#1E40AF",
      secondary: "#3B82F6",
      text: {
        primary: "#FFFFFF",
        secondary: "rgba(255, 255, 255, 0.9)",
        muted: "rgba(255, 255, 255, 0.7)"
      }
    }
  },
  {
    id: "6",
    name: "Élégant",
    color: "#18181B",
    secondaryColor: "#27272A",
    font: "'Playfair Display', serif",
    bgGradient: "bg-gradient-to-br from-gray-900 to-black",
    borderStyle: "border-gray-800/20",
    colors: {
      primary: "#18181B",
      secondary: "#27272A",
      text: {
        primary: "#FFFFFF",
        secondary: "rgba(255, 255, 255, 0.9)",
        muted: "rgba(255, 255, 255, 0.7)"
      }
    }
  },
  {
    id: "7",
    name: "Dynamique",
    color: "#059669",
    secondaryColor: "#10B981",
    font: "'DM Sans', sans-serif",
    bgGradient: "bg-gradient-to-r from-green-600 to-teal-600",
    borderStyle: "border-green-600/20",
    colors: {
      primary: "#059669",
      secondary: "#10B981",
      text: {
        primary: "#FFFFFF",
        secondary: "rgba(255, 255, 255, 0.9)",
        muted: "rgba(255, 255, 255, 0.7)"
      }
    }
  }
];