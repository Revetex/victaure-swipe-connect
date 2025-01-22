import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorOption } from "@/types/todo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  onAdd
}: NotesInputProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Ajouter une note..."
          value={newNote}
          onChange={(e) => onNoteChange(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && newNote.trim()) {
              onAdd();
            }
          }}
        />
        <Select
          value={selectedColor}
          onValueChange={onColorChange}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Couleur" />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem
                key={color.value}
                value={color.value}
                className="flex items-center gap-2"
              >
                <div className={`w-4 h-4 rounded-full sticky-note-${color.value}`} />
                <span>{color.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={onAdd}
          disabled={!newNote.trim()}
          size="icon"
        >
          +
        </Button>
      </div>
    </div>
  );
}