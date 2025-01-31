import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { motion } from "framer-motion";
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "group relative p-4 rounded-lg",
        "bg-background/50 dark:bg-gray-800/50",
        "border border-border/50",
        "shadow-sm hover:shadow-md transition-all duration-300",
        colorClass
      )}
    >
      <div className="min-h-[100px]">
        <p className="text-sm whitespace-pre-wrap break-words">
          {note.text}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(note.id)}
        className={cn(
          "absolute top-2 right-2",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity",
          "hover:text-destructive",
          "h-8 w-8"
        )}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}