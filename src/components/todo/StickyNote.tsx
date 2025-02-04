import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StickyNote as StickyNoteType } from "@/types/todo";

interface StickyNoteProps {
  note: StickyNoteType;
  colorClass?: string;
  onDelete?: (id: string) => void;
  draggable?: boolean;
}

export function StickyNote({ note, colorClass, onDelete, draggable }: StickyNoteProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <motion.div
      drag={draggable}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        setPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y
        });
      }}
      style={{ x: position.x, y: position.y }}
      className={cn(
        "group relative p-4 rounded-lg shadow-lg backdrop-blur-sm",
        "hover:shadow-xl transition-shadow duration-200",
        colorClass
      )}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete?.(note.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm whitespace-pre-wrap break-words">{note.text}</p>
    </motion.div>
  );
}