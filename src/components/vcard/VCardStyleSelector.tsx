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
    <div className="flex flex-wrap gap-2 mb-6">
      {styleOptions.map((style) => (
        <Button
          key={style.id}
          onClick={() => onStyleSelect(style)}
          variant={selectedStyle.id === style.id ? "default" : "outline"}
          className="flex items-center gap-2"
          style={{
            backgroundColor: selectedStyle.id === style.id ? style.color : 'transparent',
            borderColor: style.color,
            color: selectedStyle.id === style.id ? 'white' : style.color,
          }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: style.color }}
          />
          {style.name}
        </Button>
      ))}
    </div>
  );
}