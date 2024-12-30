import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorOption } from "@/types/todo";

interface NotesInputProps {
  newNote: string;
  selectedColor: string;
  colors: ColorOption[];
  onNoteChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onAdd: () => void;
}

export function NotesInput({
  newNote,
  selectedColor,
  colors,
  onNoteChange,
  onColorChange,
  onAdd,
}: NotesInputProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Input
        value={newNote}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Nouvelle note..."
        className="glass-card flex-1 min-w-0"
        onKeyPress={(e) => e.key === 'Enter' && onAdd()}
      />
      <div className="flex gap-2 sm:w-auto w-full">
        <Select onValueChange={onColorChange} defaultValue={selectedColor}>
          <SelectTrigger className="w-[120px] glass-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem 
                key={color.value} 
                value={color.value}
                className={`${color.class} rounded-md`}
              >
                {color.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={onAdd}
          size="icon"
          variant="outline"
          className="glass-card hover:bg-primary hover:text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}