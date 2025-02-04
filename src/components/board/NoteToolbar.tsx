import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorOption } from "@/types/todo";

interface NoteToolbarProps {
  newNote: string;
  selectedColor: string;
  colors: ColorOption[];
  onNoteChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onAddNote: () => void;
}

export function NoteToolbar({ 
  newNote, 
  selectedColor, 
  colors, 
  onNoteChange, 
  onColorChange, 
  onAddNote 
}: NoteToolbarProps) {
  return (
    <div className="flex gap-2">
      <Input
        value={newNote}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Nouvelle note..."
        className="flex-1"
        onKeyPress={(e) => e.key === 'Enter' && onAddNote()}
      />
      <Select onValueChange={onColorChange} defaultValue={selectedColor}>
        <SelectTrigger className="w-[100px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {colors.map((color) => (
            <SelectItem 
              key={color.value} 
              value={color.value}
              className={`sticky-note-${color.value}`}
            >
              {color.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onAddNote} size="icon" variant="ghost">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}