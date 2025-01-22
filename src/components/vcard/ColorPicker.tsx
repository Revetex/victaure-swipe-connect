import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(color);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className={cn("flex gap-2 items-center", className)}>
      <div className="relative flex-shrink-0">
        <Input
          type="color"
          value={color}
          onChange={handleInputChange}
          className="w-[4rem] h-12 p-1 cursor-pointer bg-white dark:bg-gray-800 border-2"
        />
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Ex: #000000 ou rgb(0, 0, 0)"
        className="flex-1 h-12 bg-white dark:bg-gray-800 border-2"
      />
      <div 
        className="w-12 h-12 rounded border-2 shadow-inner"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}