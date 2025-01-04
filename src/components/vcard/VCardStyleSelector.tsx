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
          className={`flex items-center gap-2 ${
            selectedStyle.id === style.id ? style.colorScheme.primary : "bg-transparent"
          }`}
        >
          <div
            className={`w-3 h-3 rounded-full ${style.colorScheme.primary}`}
          />
          {style.name}
        </Button>
      ))}
    </div>
  );
}