import { Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Resizable } from "re-resizable";

interface StickyNoteProps {
  note: StickyNoteType;
  colorClass: string;
  onDelete: (id: string) => void;
}

export function StickyNote({ note, colorClass, onDelete }: StickyNoteProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 200, height: 150 });

  const getBackgroundColor = () => {
    switch (note.color) {
      case "yellow":
        return "bg-[#FEF7CD]/90 hover:bg-[#FEF7CD]";
      case "blue":
        return "bg-[#D3E4FD]/90 hover:bg-[#D3E4FD]";
      case "green":
        return "bg-[#F2FCE2]/90 hover:bg-[#F2FCE2]";
      case "pink":
        return "bg-[#FFDEE2]/90 hover:bg-[#FFDEE2]";
      case "purple":
        return "bg-[#E5DEFF]/90 hover:bg-[#E5DEFF]";
      case "orange":
        return "bg-[#FEC6A1]/90 hover:bg-[#FEC6A1]";
      default:
        return "bg-[#FEF7CD]/90 hover:bg-[#FEF7CD]";
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        setPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        });
      }}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      className="absolute"
      style={{ 
        touchAction: "none",
        zIndex: isExpanded ? 50 : 1 
      }}
    >
      <Resizable
        size={size}
        onResizeStop={(e, direction, ref, d) => {
          setSize({
            width: size.width + d.width,
            height: size.height + d.height,
          });
        }}
        minWidth={150}
        minHeight={100}
        maxWidth={600}
        maxHeight={800}
        className={cn(
          "group relative p-4 rounded-lg transition-all duration-300",
          "border border-border/10",
          "shadow-sm hover:shadow-md",
          getBackgroundColor(),
          "cursor-move"
        )}
      >
        <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="h-8 w-8 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <div className="h-8 w-8 flex items-center justify-center cursor-move">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <p className="text-sm whitespace-pre-wrap break-words text-gray-700">
            {note.text}
          </p>
        </div>
      </Resizable>
    </motion.div>
  );
}