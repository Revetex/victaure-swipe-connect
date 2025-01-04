import { StyleOption } from "./types";

export const styleOptions: StyleOption[] = [
  {
    id: 1,
    name: "Classique",
    color: "#2563EB",
    font: "poppins",
    displayStyle: "classic",
    bgGradient: "from-blue-600 to-blue-800",
    secondaryColor: "#60A5FA",
    accentGradient: "linear-gradient(135deg, rgba(37, 99, 235, 0.3), rgba(96, 165, 250, 0.3))",
    borderStyle: "border-l-4"
  },
  {
    id: 2,
    name: "Élégant",
    color: "#059669",
    font: "playfair",
    displayStyle: "elegant",
    bgGradient: "from-emerald-600 to-emerald-800",
    secondaryColor: "#34D399",
    accentGradient: "linear-gradient(135deg, rgba(5, 150, 105, 0.3), rgba(52, 211, 153, 0.3))",
    borderStyle: "border-b-4"
  }
];