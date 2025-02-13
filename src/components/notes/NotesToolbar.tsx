
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorOption } from "@/types/todo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

  const getColorClass = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-[#FEF7CD]';
      case 'blue':
        return 'bg-[#D3E4FD]';
      case 'green':
        return 'bg-[#F2FCE2]';
      case 'purple':
        return 'bg-[#E5DEFF]';
      case 'orange':
        return 'bg-[#FEC6A1]';
      default:
        return 'bg-[#FEF7CD]';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
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
            getColorClass(selectedColor)
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
                  getColorClass(color.value)
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  getColorClass(color.value)
                )} />
                {color.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button 
          onClick={handleAddNote} 
          size="icon" 
          variant="default"
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
