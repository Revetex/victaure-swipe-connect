
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface StickyNoteProps {
  note: StickyNoteType;
  colorClass: string;
  onDelete: (id: string) => void;
  layout?: 'grid' | 'masonry' | 'list';
}

export function StickyNote({ note, colorClass, onDelete, layout = 'grid' }: StickyNoteProps) {
  const getNoteColorClass = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'sticky-note-yellow';
      case 'blue':
        return 'sticky-note-blue';
      case 'green':
        return 'sticky-note-green';
      case 'purple':
        return 'sticky-note-purple';
      case 'orange':
        return 'sticky-note-orange';
      default:
        return 'sticky-note-yellow';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: layout === 'list' ? 1.01 : 1.02, rotate: layout === 'list' ? 0 : 1 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className={cn(
        "sticky-note group",
        getNoteColorClass(note.color),
        "touch-manipulation relative overflow-hidden",
        "before:content-[''] before:absolute before:inset-0",
        "before:bg-gradient-to-br before:from-white/5 before:to-transparent",
        "after:content-[''] after:absolute after:bottom-0 after:right-0",
        "after:w-8 after:h-8 after:bg-gradient-to-br",
        "after:from-black/0 after:to-black/5 after:rounded-tl-2xl",
        "shadow-lg hover:shadow-xl transition-shadow",
        layout === 'list' && "flex items-start gap-4"
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

      <div className={cn(
        "pt-2 pb-8 px-4",
        layout === 'list' && "flex-1 py-4"
      )}>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {note.text}
        </p>
        
        <div className="mt-4 text-xs text-muted-foreground/70">
          {note.created_at && (
            <time dateTime={note.created_at}>
              {format(new Date(note.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
            </time>
          )}
        </div>
      </div>
    </motion.div>
  );
}
