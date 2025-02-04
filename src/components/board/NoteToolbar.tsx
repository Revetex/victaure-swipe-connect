import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorOption } from "@/types/todo";
import { toast } from "sonner";

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
  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("La note ne peut pas être vide");
      return;
    }
    onAddNote();
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex gap-2">
        <Input
          value={newNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Nouvelle note..."
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
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
        <Button onClick={handleAddNote} size="icon" variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}