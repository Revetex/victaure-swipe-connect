import { Camera, Music, Palette } from "lucide-react";
import { CategoryConfig } from "./categoryTypes";

export const creativeCategories: Record<string, CategoryConfig> = {
  "Design": {
    icon: Palette,
    subcategories: [
      "3D",
      "Branding",
      "Graphisme",
      "Illustration",
      "Motion Design",
      "UI/UX",
      "Web Design"
    ]
  },
  "Médias": {
    icon: Camera,
    subcategories: [
      "Audio",
      "Journalisme",
      "Photo",
      "Production",
      "Vidéo"
    ]
  },
  "Arts": {
    icon: Music,
    subcategories: [
      "Musique",
      "Danse",
      "Théâtre",
      "Arts visuels",
      "Arts numériques"
    ]
  }
};