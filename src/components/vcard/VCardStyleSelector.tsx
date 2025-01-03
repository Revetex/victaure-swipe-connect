import { Button } from "@/components/ui/button";
import { StyleOption } from "./types";

interface VCardStyleSelectorProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => void;
  styleOptions: StyleOption[];
}

export function VCardStyleSelector({
  selectedStyle,
  onStyleSelect,
  styleOptions,
}: VCardStyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {styleOptions.map((style) => (
        <Button
          key={style.id}
          onClick={() => onStyleSelect(style)}
          className={`p-4 rounded-lg transition-all duration-300 relative overflow-hidden group ${
            selectedStyle.id === style.id 
            ? 'ring-2 ring-white scale-105' 
            : 'hover:ring-2 hover:ring-white/50 hover:scale-105'
          }`}
          style={{ 
            background: `linear-gradient(135deg, ${style.color}, ${style.secondaryColor})` 
          }}
        >
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ 
              background: style.accentGradient
            }} 
          />
          <span className="relative z-10 text-white text-sm font-medium">
            {style.name}
          </span>
        </Button>
      ))}
    </div>
  );
}