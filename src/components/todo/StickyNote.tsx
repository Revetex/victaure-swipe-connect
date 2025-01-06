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
      className={cn(
        "sticky-note group transform rotate-1 hover:rotate-0",
        "min-h-[120px] sm:min-h-[100px]", // Plus grand sur mobile
        "p-5 sm:p-4", // Plus de padding sur mobile
        "touch-manipulation", // Améliore la réponse tactile
        colorClass
      )}
    >
      <div className="flex justify-between items-start gap-3">
        <p className={cn(
          "flex-1 whitespace-pre-wrap",
          "text-base sm:text-sm", // Plus grand sur mobile
          "font-medium text-black",
          "leading-relaxed" // Meilleure lisibilité
        )}>
          {note.text}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(note.id)}
          className={cn(
            "opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100",
            "transition-opacity hover:text-destructive",
            "-mt-2 -mr-2",
            "h-10 w-10 sm:h-8 sm:w-8", // Plus grand sur mobile
            "active:opacity-100", // Toujours visible au toucher sur mobile
          )}
        >
          <Trash2 className="h-5 w-5 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </motion.div>
  );
}