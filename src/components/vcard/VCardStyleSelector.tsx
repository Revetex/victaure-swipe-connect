import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { styleOptions } from "./styles";
import { StyleOption } from "./types";

interface VCardStyleSelectorProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => void;
  isEditing: boolean;
}

export function VCardStyleSelector({ selectedStyle, onStyleSelect, isEditing }: VCardStyleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Style de carte
      </label>
      <Select 
        value={selectedStyle.id} 
        onValueChange={(value) => {
          const style = styleOptions.find(s => s.id === value);
          if (style) {
            onStyleSelect(style);
          }
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionnez un style" />
        </SelectTrigger>
        <SelectContent>
          {styleOptions.map((style) => (
            <SelectItem key={style.id} value={style.id}>
              {style.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}