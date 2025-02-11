
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorOption } from "@/types/todo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface NotesToolbarProps {
  newNote: string;
  selectedColor: string;
  colors: ColorOption[];
  onNoteChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onAdd: () => void;
}

export function NotesToolbar({ 
  newNote, 
  selectedColor, 
  colors, 
  onNoteChange, 
  onColorChange, 
  onAdd 
}: NotesToolbarProps) {
  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("La note ne peut pas être vide");
      return;
    }
    onAdd();
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
        <Select value={selectedColor} onValueChange={onColorChange}>
          <SelectTrigger className={cn(
            "w-[100px]",
            `sticky-note-${selectedColor}`
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem 
                key={color.value} 
                value={color.value}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  `sticky-note-${color.value}`,
                  selectedColor === color.value && "bg-accent"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  `bg-${color.value}-200`
                )} />
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
