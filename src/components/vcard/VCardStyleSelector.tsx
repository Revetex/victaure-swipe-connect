
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVCardStyle } from "./VCardStyleContext";
import { Palette } from "lucide-react";
import { StyleOption } from "./types";

const styles: StyleOption[] = [
  {
    id: "modern",
    name: "Moderne",
    color: "#047857",
    secondaryColor: "#10B981",
    font: "Inter, sans-serif",
    bgGradient: "bg-gradient-to-br from-emerald-50 via-teal-100 to-emerald-200",
    colors: {
      primary: "#065F46",
      secondary: "#10B981",
      text: {
        primary: "#064E3B",
        secondary: "#065F46",
        muted: "#047857",
      },
      background: {
        card: "#FFFFFF",
        section: "#F9FAFB",
        button: "#065F46"
      }
    }
  },
  {
    id: "elegant",
    name: "Élégant",
    color: "#7C3AED",
    secondaryColor: "#8B5CF6",
    font: "Playfair Display, serif",
    bgGradient: "bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200",
    colors: {
      primary: "#6D28D9",
      secondary: "#8B5CF6",
      text: {
        primary: "#5B21B6",
        secondary: "#6D28D9",
        muted: "#7C3AED",
      },
      background: {
        card: "#FFFFFF",
        section: "#F9FAFB",
        button: "#6D28D9"
      }
    }
  },
  {
    id: "minimal",
    name: "Minimaliste",
    color: "#374151",
    secondaryColor: "#4B5563",
    font: "Montserrat, sans-serif",
    bgGradient: "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200",
    colors: {
      primary: "#1F2937",
      secondary: "#4B5563",
      text: {
        primary: "#111827",
        secondary: "#1F2937",
        muted: "#374151",
      },
      background: {
        card: "#FFFFFF",
        section: "#F9FAFB",
        button: "#1F2937"
      }
    }
  }
];

export function VCardStyleSelector() {
  const { selectedStyle, setSelectedStyle } = useVCardStyle();

  const handleStyleChange = (styleId: string) => {
    const newStyle = styles.find(style => style.id === styleId);
    if (newStyle) {
      setSelectedStyle(newStyle);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 sm:p-0">
      <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      <Select value={selectedStyle.id} onValueChange={handleStyleChange}>
        <SelectTrigger className="w-[180px] bg-white dark:bg-gray-800">
          <SelectValue placeholder="Choisir un style" />
        </SelectTrigger>
        <SelectContent>
          {styles.map((style) => (
            <SelectItem key={style.id} value={style.id}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: style.color }}
                />
                {style.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
