
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface StickyNoteProps {
  note: StickyNoteType;
  onDelete: (id: string) => void;
  layout?: 'grid' | 'masonry' | 'list';
}

export function StickyNote({ note, onDelete, layout = 'grid' }: StickyNoteProps) {
  const getColorClass = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-[#FEF7CD]/90 hover:bg-[#FEF7CD] border-yellow-200/50';
      case 'blue':
        return 'bg-[#D3E4FD]/90 hover:bg-[#D3E4FD] border-blue-200/50';
      case 'green':
        return 'bg-[#F2FCE2]/90 hover:bg-[#F2FCE2] border-green-200/50';
      case 'purple':
        return 'bg-[#E5DEFF]/90 hover:bg-[#E5DEFF] border-purple-200/50';
      case 'orange':
        return 'bg-[#FEC6A1]/90 hover:bg-[#FEC6A1] border-orange-200/50';
      default:
        return 'bg-[#FEF7CD]/90 hover:bg-[#FEF7CD] border-yellow-200/50';
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
        "border shadow-lg group",
        getColorClass(note.color),
        "touch-manipulation relative overflow-hidden",
        "before:content-[''] before:absolute before:inset-0",
        "before:bg-gradient-to-br before:from-white/5 before:to-transparent",
        "after:content-[''] after:absolute after:bottom-0 after:right-0",
        "after:w-8 after:h-8 after:bg-gradient-to-br",
        "after:from-black/0 after:to-black/5 after:rounded-tl-2xl",
        "hover:shadow-xl transition-all duration-300",
        layout === 'list' ? "flex items-start gap-4 rounded-lg p-4" : "rounded-lg p-6 min-h-[280px]"
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
        "w-full",
        layout === 'list' ? "flex-1" : ""
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
