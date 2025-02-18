
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVCardStyle } from "./VCardStyleContext";
import { Palette } from "lucide-react";

export function VCardStyleSelector() {
  const { selectedStyle, setSelectedStyle, styles } = useVCardStyle();

  const handleStyleChange = (styleId: string) => {
    const newStyle = styles.find(style => style.id === styleId);
    if (newStyle) {
      setSelectedStyle(newStyle);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 sm:p-0">
      <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      <Select value={selectedStyle.id} onValueChange={handleStyleChange}>
        <SelectTrigger className="w-[150px] sm:w-[180px] bg-white/90 dark:bg-gray-800/90 text-sm sm:text-base">
          <SelectValue placeholder="Choisir un style" />
        </SelectTrigger>
        <SelectContent className="bg-white/95 dark:bg-gray-800/95">
          {styles.map((style) => (
            <SelectItem key={style.id} value={style.id}>
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: style.color }}
                />
                <span className="text-sm">{style.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
