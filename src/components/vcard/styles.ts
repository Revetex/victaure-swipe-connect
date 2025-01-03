import { StyleOption } from "./types";

export const styleOptions: StyleOption[] = [
  {
    id: 1,
    name: "Classique",
    color: "#1E40AF",
    font: "poppins",
    displayStyle: "default",
    bgGradient: "from-blue-600 to-blue-800",
    secondaryColor: "#60A5FA",
    accentGradient: "linear-gradient(135deg, rgba(96, 165, 250, 0.2), rgba(30, 64, 175, 0.2))"
  },
  {
    id: 2,
    name: "Chaleureux",
    color: "#F59E0B",
    font: "montserrat",
    displayStyle: "warm",
    bgGradient: "from-amber-500 to-orange-600",
    secondaryColor: "#FCD34D",
    accentGradient: "linear-gradient(135deg, rgba(252, 211, 77, 0.2), rgba(245, 158, 11, 0.2))"
  },
  {
    id: 3,
    name: "Moderne",
    color: "#10B981",
    font: "roboto",
    displayStyle: "modern",
    bgGradient: "from-emerald-500 to-teal-600",
    secondaryColor: "#34D399",
    accentGradient: "linear-gradient(135deg, rgba(52, 211, 153, 0.2), rgba(16, 185, 129, 0.2))",
    borderStyle: "border-l-4"
  },
  {
    id: 4,
    name: "Élégant",
    color: "#8B5CF6",
    font: "playfair",
    displayStyle: "elegant",
    bgGradient: "from-violet-600 via-purple-600 to-indigo-700",
    secondaryColor: "#A78BFA",
    accentGradient: "linear-gradient(135deg, rgba(167, 139, 250, 0.2), rgba(139, 92, 246, 0.2))",
    borderStyle: "rounded-xl"
  },
  {
    id: 5,
    name: "Audacieux",
    color: "#EC4899",
    font: "opensans",
    displayStyle: "bold",
    bgGradient: "from-pink-600 via-rose-600 to-red-600",
    secondaryColor: "#F472B6",
    accentGradient: "linear-gradient(135deg, rgba(244, 114, 182, 0.2), rgba(236, 72, 153, 0.2))"
  },
  {
    id: 6,
    name: "Minimaliste",
    color: "#6B7280",
    font: "inter",
    displayStyle: "minimal",
    bgGradient: "from-gray-700 to-gray-800",
    secondaryColor: "#9CA3AF",
    accentGradient: "linear-gradient(135deg, rgba(156, 163, 175, 0.2), rgba(107, 114, 128, 0.2))",
    borderStyle: "border-t-2"
  },
  {
    id: 7,
    name: "Créatif",
    color: "#F97316",
    font: "quicksand",
    displayStyle: "creative",
    bgGradient: "from-orange-500 via-amber-500 to-yellow-500",
    secondaryColor: "#FB923C",
    accentGradient: "linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(249, 115, 22, 0.2))",
    borderStyle: "rounded-full"
  },
  {
    id: 8,
    name: "Professionnel",
    color: "#0284C7",
    font: "lato",
    displayStyle: "professional",
    bgGradient: "from-sky-600 via-blue-600 to-indigo-600",
    secondaryColor: "#38BDF8",
    accentGradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(2, 132, 199, 0.2))",
    borderStyle: "border-b-2"
  }
];