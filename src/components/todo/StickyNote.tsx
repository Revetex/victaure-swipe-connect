
import { Trash2, Edit2, Save } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

interface StickyNoteProps {
  note: StickyNoteType;
  onDelete: (id: string) => void;
  onUpdate?: (note: StickyNoteType) => void;
  layout?: 'grid' | 'masonry' | 'list';
  isDraggable?: boolean;
}

export function StickyNote({ note, onDelete, onUpdate, layout = 'grid' }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);

  const getColorClass = (color: string) => {
    switch (color) {
      case 'yellow':
        return 'bg-[#FEF7CD]/90 hover:bg-[#FEF7CD] border-yellow-200/50 text-zinc-800';
      case 'blue':
        return 'bg-[#D3E4FD]/90 hover:bg-[#D3E4FD] border-blue-200/50 text-zinc-800';
      case 'green':
        return 'bg-[#F2FCE2]/90 hover:bg-[#F2FCE2] border-green-200/50 text-zinc-800';
      case 'purple':
        return 'bg-[#E5DEFF]/90 hover:bg-[#E5DEFF] border-purple-200/50 text-zinc-800';
      case 'orange':
        return 'bg-[#FEC6A1]/90 hover:bg-[#FEC6A1] border-orange-200/50 text-zinc-900';
      default:
        return 'bg-[#FEF7CD]/90 hover:bg-[#FEF7CD] border-yellow-200/50 text-zinc-800';
    }
  };

  const handleSave = () => {
    if (!onUpdate) return;
    
    onUpdate({
      ...note,
      text: editedText
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full h-full",
        "border shadow-lg group relative overflow-hidden transition-all duration-300",
        getColorClass(note.color),
        "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent",
        "after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-8 after:bg-gradient-to-br",
        "after:from-black/0 after:to-black/5 after:rounded-tl-2xl",
        "hover:shadow-xl hover:scale-[1.02]",
        layout === 'list' ? "flex items-start gap-4 rounded-lg p-4" : "rounded-lg p-6"
      )}
    >
      <div className="flex flex-col h-full w-full min-h-[200px]">
        <div className="flex-1">
          {isEditing ? (
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[100px] bg-transparent border-none focus-visible:ring-1 focus-visible:ring-black/20 resize-none"
              autoFocus
            />
          ) : (
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {note.text}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/10">
          <div className="text-xs text-black/50">
            {note.created_at && (
              <time dateTime={note.created_at}>
                {format(new Date(note.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </time>
            )}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="bg-black/5 hover:bg-black/10"
              >
                <Save className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="bg-black/5 hover:bg-black/10"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/5 hover:bg-black/10 hover:text-red-500"
              onClick={() => onDelete(note.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
