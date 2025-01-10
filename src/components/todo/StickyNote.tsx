import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StickyNoteProps {
  note: StickyNoteType;
  colorClass: string;
  onDelete: (id: string) => void;
}

export function StickyNote({ note, colorClass, onDelete }: StickyNoteProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      whileHover={{ scale: 1.02, rotate: 0 }}
      className={cn(
        "sticky-note group transform rotate-1",
        "min-h-[120px] sm:min-h-[100px]",
        "p-5 sm:p-4",
        "touch-manipulation",
        "shadow-md hover:shadow-lg transition-shadow",
        colorClass
      )}
    >
      <div className="flex justify-between items-start gap-3">
        <p className={cn(
          "flex-1 whitespace-pre-wrap",
          "text-base sm:text-sm",
          "font-medium text-black/80",
          "leading-relaxed"
        )}>
          {note.text}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(note.id)}
          className={cn(
            "opacity-0 group-hover:opacity-100 sm:opacity-100",
            "transition-all duration-200",
            "hover:bg-black/10 hover:text-black",
            "-mt-2 -mr-2",
            "h-8 w-8",
            "active:opacity-100"
          )}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}