import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StickyNoteProps {
  note: StickyNoteType;
  colorClass: string;
  onDelete: (id: number) => void;
}

export function StickyNote({ note, colorClass, onDelete }: StickyNoteProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className={cn(
        "sticky-note group transform rotate-1 hover:rotate-0",
        colorClass,
        "transition-all duration-300"
      )}
    >
      <div className="flex justify-between items-start gap-2">
        <p className="flex-1 whitespace-pre-wrap text-sm text-gray-800">{note.text}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(note.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive -mt-2 -mr-2"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}