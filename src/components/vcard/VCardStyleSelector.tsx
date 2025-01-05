import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { styleOptions } from "./styles";

interface VCardStyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

export function VCardStyleSelector({ selectedStyle, onStyleChange }: VCardStyleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Style de carte
      </label>
      <Select value={selectedStyle} onValueChange={onStyleChange}>
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