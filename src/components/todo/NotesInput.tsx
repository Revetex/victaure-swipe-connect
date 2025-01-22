import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
        <div className="flex gap-1">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => onColorChange(color.value)}
              className={`w-8 h-8 rounded-full ${
                selectedColor === color.value ? 'ring-2 ring-offset-2 ring-primary' : ''
              } ${color.class}`}
            />
          ))}
        </div>
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