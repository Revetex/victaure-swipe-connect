import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      <div className="relative flex-shrink-0">
        <Input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 p-1 bg-background/50 border-border"
        />
      </div>
      <Input
        value={color}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: #000000 ou rgb(0, 0, 0)"
        className="flex-1 bg-background/50 border-border text-foreground"
      />
    </div>
  );
}