import { Palette, Camera, Music } from "lucide-react";
import type { CategoryConfig } from "./categoryTypes";

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
  }
};