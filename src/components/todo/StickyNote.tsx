import { Button } from "@/components/ui/button";
import { Trash2, StickyNote as StickyNoteIcon } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StickyNoteProps {
  note: StickyNoteType;
  colorClass: string;
  onDelete: (id: string) => void;
}

export function StickyNote({ note, colorClass, onDelete }: StickyNoteProps) {
  // Construire la classe de couleur complète
  const fullColorClass = `sticky-note-${colorClass}`;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      whileHover={{ scale: 1.02, rotate: 0 }}
      className={cn(
        "sticky-note",
        "min-h-[120px] sm:min-h-[100px]",
        "p-5 sm:p-4",
        "touch-manipulation",
        "shadow-md hover:shadow-lg transition-shadow",
        "relative",
        fullColorClass
      )}
    >
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(note.id)}
          className={cn(
            "opacity-0 group-hover:opacity-100 sm:opacity-100",
            "transition-all duration-200",
            "hover:bg-black/10 hover:text-black",
            "h-8 w-8",
            "active:opacity-100"
          )}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <StickyNoteIcon className="h-4 w-4 text-black/70" />
            <p className="text-sm font-medium text-black/70">Note</p>
          </div>
          <p className={cn(
            "whitespace-pre-wrap",
            "text-base sm:text-sm",
            "font-medium text-black/80",
            "leading-relaxed"
          )}>
            {note.text}
          </p>
        </div>
      </div>
    </motion.div>
  );
}