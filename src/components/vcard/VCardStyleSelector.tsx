
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVCardStyle } from "./VCardStyleContext";
import { Palette } from "lucide-react";

const styles = [
  {
    id: "modern",
    name: "Moderne",
    color: "#047857",
    bgGradient: "bg-gradient-to-br from-emerald-50 via-teal-100 to-emerald-200",
  },
  {
    id: "elegant",
    name: "Élégant",
    color: "#7C3AED",
    bgGradient: "bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200",
  },
  {
    id: "bold",
    name: "Audacieux",
    color: "#BE185D",
    bgGradient: "bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200",
  },
  {
    id: "minimal",
    name: "Minimaliste",
    color: "#374151",
    bgGradient: "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200",
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
    <div className="flex items-center gap-2">
      <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      <Select value={selectedStyle.id} onValueChange={handleStyleChange}>
        <SelectTrigger className="w-[180px]">
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
