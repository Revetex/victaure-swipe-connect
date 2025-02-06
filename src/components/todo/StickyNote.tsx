import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StickyNoteProps {
  note: StickyNoteType;
  colorClass: string;
  onDelete: (id: string) => void;
}

export function StickyNote({ note, colorClass, onDelete }: StickyNoteProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "sticky-note group",
        colorClass,
        "touch-manipulation"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        onClick={() => onDelete(note.id)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Supprimer</span>
      </Button>

      <div className="pt-2 pb-8 px-2">
        <p className="whitespace-pre-wrap break-words text-sm">
          {note.text}
        </p>
      </div>
    </motion.div>
  );
}