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
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      yellow: "bg-yellow-100 text-yellow-950 border-yellow-200",
      blue: "bg-blue-100 text-blue-950 border-blue-200",
      green: "bg-green-100 text-green-950 border-green-200",
      pink: "bg-pink-100 text-pink-950 border-pink-200",
      purple: "bg-purple-100 text-purple-950 border-purple-200",
      orange: "bg-orange-100 text-orange-950 border-orange-200"
    };
    return colorMap[color] || "bg-white text-gray-950 border-gray-200";
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      whileHover={{ scale: 1.02, rotate: 0 }}
      className={cn(
        "sticky-note group",
        "min-h-[120px] sm:min-h-[100px]",
        "p-5 sm:p-4",
        "touch-manipulation",
        "shadow-md hover:shadow-lg transition-shadow",
        "relative border-2 rounded-lg",
        getColorClasses(note.color)
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