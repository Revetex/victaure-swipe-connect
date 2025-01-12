import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { styleOptions } from "./styles";
import { StyleOption } from "./types";

interface VCardStyleSelectorProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => void;
}

export function VCardStyleSelector({ selectedStyle, onStyleSelect }: VCardStyleSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {styleOptions.map((style) => (
        <Button
          key={style.id}
          onClick={() => onStyleSelect(style)}
          className={cn(
            "relative h-20 w-full",
            selectedStyle.id === style.id ? "ring-2 ring-blue-500" : "hover:ring-2 hover:ring-blue-500/50"
          )}
          style={{
            background: style.bgGradient,
            color: "#1E40AF", // Blue color for selection buttons
          }}
        >
          <span className="font-medium">{style.name}</span>
          {selectedStyle.id === style.id && (
            <div className="absolute inset-0 border-2 border-blue-500 rounded-md" />
          )}
        </Button>
      ))}
    </div>
  );
}