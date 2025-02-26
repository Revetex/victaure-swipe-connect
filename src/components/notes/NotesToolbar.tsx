
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
        return 'bg-[#FEF7CD] text-zinc-800';
      case 'blue':
        return 'bg-[#D3E4FD] text-zinc-800';
      case 'green':
        return 'bg-[#F2FCE2] text-zinc-800';
      case 'purple':
        return 'bg-[#E5DEFF] text-zinc-800';
      case 'orange':
        return 'bg-[#FEC6A1] text-zinc-800';
      default:
        return 'bg-[#FEF7CD] text-zinc-800';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full",
        "bg-[#2A3441]/80 backdrop-blur-lg",
        "border-b border-white/10",
        "shadow-lg shadow-black/10",
        "p-4"
      )}
    >
      <div className="max-w-2xl mx-auto flex gap-2">
        <Input 
          value={newNote} 
          onChange={e => onNoteChange(e.target.value)} 
          placeholder="Nouvelle note..."
          className="flex-1 bg-[#1A1F2C]/50 text-[#F2EBE4] border-white/10 placeholder:text-[#F2EBE4]/50"
          onKeyPress={e => e.key === 'Enter' && handleAddNote()} 
        />

        <Select value={selectedColor} onValueChange={onColorChange}>
          <SelectTrigger className={cn(
            "w-[120px]",
            "bg-[#1A1F2C]/50 border-white/10",
            "hover:bg-[#1A1F2C]/70",
            "transition-colors"
          )}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#2A3441] border-white/10">
            {colors.map(color => (
              <SelectItem 
                key={color.value} 
                value={color.value}
                className={cn(
                  "flex items-center gap-2 cursor-pointer",
                  "hover:bg-white/5"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full",
                  getColorClass(color.value)
                )} />
                <span className="text-[#F2EBE4]">{color.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={handleAddNote}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
