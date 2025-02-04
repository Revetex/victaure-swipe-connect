import { Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StickyNoteProps {
  note: StickyNoteType;
  colorClass: string;
  onDelete: (id: string) => void;
}

export function StickyNote({ note, colorClass, onDelete }: StickyNoteProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "group relative p-4 rounded-lg transition-all duration-300",
        "bg-background/50 dark:bg-gray-800/50",
        "border border-border/50",
        "shadow-sm hover:shadow-md",
        colorClass,
        isExpanded ? "h-[300px]" : "h-[150px]",
        "cursor-pointer"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className={cn(
            "h-8 w-8",
            "hover:text-destructive",
            "transition-colors"
          )}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="h-8 w-8 flex items-center justify-center">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      <div className={cn(
        "h-full overflow-auto",
        "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
      )}>
        <p className="text-sm whitespace-pre-wrap break-words">
          {note.text}
        </p>
      </div>
    </motion.div>
  );
}