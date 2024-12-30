import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-2"
    >
      <Input
        value={newNote}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Nouvelle note..."
        className="glass-card flex-1"
        onKeyPress={(e) => e.key === 'Enter' && newNote.trim() && onAdd()}
      />
      <Select onValueChange={onColorChange} defaultValue={selectedColor}>
        <SelectTrigger className="w-[100px] glass-card">
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
        disabled={!newNote.trim()} 
        size="icon"
        variant="outline"
        className="glass-card hover:bg-primary hover:text-white transition-colors"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}