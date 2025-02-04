import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorOption } from "@/types/todo";
import { cn } from "@/lib/utils";

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
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onAdd();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <Input
        value={newNote}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Nouvelle note..."
        className="flex-1 min-w-0 bg-background/50 text-foreground"
        onKeyPress={handleKeyPress}
      />
      <div className="flex gap-2 sm:w-auto w-full">
        <Select onValueChange={onColorChange} value={selectedColor}>
          <SelectTrigger className={cn(
            "w-[120px] bg-background/50",
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
                  "flex items-center gap-2",
                  `sticky-note-${color.value}`
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  color.value === "yellow" && "bg-[#FEF7CD]",
                  color.value === "blue" && "bg-[#D3E4FD]",
                  color.value === "green" && "bg-[#F2FCE2]",
                  color.value === "pink" && "bg-[#FFDEE2]",
                  color.value === "purple" && "bg-[#E5DEFF]",
                  color.value === "orange" && "bg-[#FEC6A1]"
                )} />
                {color.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={onAdd} 
          size="icon"
          variant="outline"
          className="hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}