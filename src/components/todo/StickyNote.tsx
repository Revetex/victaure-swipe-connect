
import { motion } from "framer-motion";
import { Trash2, Edit2, Save, Grip } from "lucide-react";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

interface StickyNoteProps {
  note: StickyNoteType;
  onDelete: (id: string) => void;
  onUpdate?: (note: StickyNoteType) => void;
  layout?: 'grid' | 'masonry' | 'list';
  isDraggable?: boolean;
}

export function StickyNote({ note, onDelete, onUpdate, layout = 'grid', isDraggable = false }: StickyNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(note.text);
  const [position, setPosition] = useState(note.position || { x: 0, y: 0 });

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

  const handleDragEnd = (event: any, info: any) => {
    if (!onUpdate || !isDraggable) return;
    
    const container = document.querySelector('.notes-container');
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const noteRect = event.target.getBoundingClientRect();

    let newX = position.x + info.offset.x;
    let newY = position.y + info.offset.y;

    newX = Math.max(0, Math.min(newX, containerRect.width - noteRect.width));
    newY = Math.max(0, Math.min(newY, containerRect.height - noteRect.height));

    const newPosition = { x: newX, y: newY };
    setPosition(newPosition);
    onUpdate({
      ...note,
      position: newPosition
    });
  };

  const handleSave = () => {
    if (!onUpdate) return;
    
    onUpdate({
      ...note,
      text: editedText
    });
    setIsEditing(false);
  };

  const handleResize = (e: any, { size }: { size: { width: number; height: number } }) => {
    if (!onUpdate) return;
    
    onUpdate({
      ...note,
      metadata: {
        ...note.metadata,
        width: size.width,
        height: size.height
      }
    });
  };

  const width = note.metadata?.width || 280;
  const height = note.metadata?.height || 280;

  const noteContent = (
    <div className={cn(
      "border shadow-lg group relative overflow-hidden transition-all duration-300",
      getColorClass(note.color),
      isDraggable ? "cursor-grab active:cursor-grabbing" : "",
      "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent",
      "after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-8 after:bg-gradient-to-br",
      "after:from-black/0 after:to-black/5 after:rounded-tl-2xl",
      "hover:shadow-xl hover:scale-[1.02]",
      layout === 'list' ? "flex items-start gap-4 rounded-lg p-4" : "rounded-lg p-6"
    )}>
      <div className="flex justify-between items-start w-full gap-2">
        <div className={cn(
          "w-full",
          layout === 'list' ? "flex-1" : ""
        )}>
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
          
          <div className="mt-4 text-xs text-muted-foreground/70">
            {note.created_at && (
              <time dateTime={note.created_at}>
                {format(new Date(note.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
              </time>
            )}
          </div>
        </div>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
  );

  if (layout === 'grid' || layout === 'masonry') {
    return (
      <motion.div
        drag={isDraggable}
        dragMomentum={false}
        dragConstraints={{ left: 0, top: 0, right: window.innerWidth - width, bottom: window.innerHeight - height }}
        onDragEnd={handleDragEnd}
        initial={false}
        animate={{
          x: position.x,
          y: position.y,
          scale: isEditing ? 1.02 : 1
        }}
        className="absolute"
      >
        <ResizableBox
          width={width}
          height={height}
          onResize={handleResize}
          minConstraints={[200, 200]}
          maxConstraints={[500, 500]}
          resizeHandles={['se']}
          handle={
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center">
              <Grip className="h-3 w-3 text-muted-foreground/40" />
            </div>
          }
        >
          {noteContent}
        </ResizableBox>
      </motion.div>
    );
  }

  return noteContent;
}
