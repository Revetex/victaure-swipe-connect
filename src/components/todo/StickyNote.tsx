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
      whileHover={{ scale: 1.02, rotate: 1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "sticky-note group h-full",
        colorClass,
        "touch-manipulation relative overflow-hidden",
        "before:content-[''] before:absolute before:inset-0",
        "before:bg-gradient-to-br before:from-white/5 before:to-transparent",
        "after:content-[''] after:absolute after:bottom-0 after:right-0",
        "after:w-8 after:h-8 after:bg-gradient-to-br",
        "after:from-black/0 after:to-black/5 after:rounded-tl-2xl",
        "shadow-lg hover:shadow-xl transition-shadow"
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-2 right-2 opacity-0 group-hover:opacity-100",
          "focus:opacity-100 transition-opacity",
          "bg-background/20 hover:bg-background/40"
        )}
        onClick={() => onDelete(note.id)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Supprimer</span>
      </Button>

      <div className="pt-2 pb-8 px-4">
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {note.text}
        </p>
      </div>
    </motion.div>
  );
}