
import { motion } from "framer-motion";
import { Grip } from "lucide-react";
import { ResizableBox } from "react-resizable";
import { cn } from "@/lib/utils";
import type { StickyNote } from "@/types/todo";

interface StickyNoteWrapperProps {
  note: StickyNote;
  position: { x: number; y: number };
  isDraggable?: boolean;
  layout?: 'grid' | 'masonry' | 'list';
  width: number;
  height: number;
  children: React.ReactNode;
  onDragEnd: (event: any, info: any) => void;
  onResize: (e: any, data: { size: { width: number; height: number } }) => void;
}

export function StickyNoteWrapper({
  note,
  position,
  isDraggable = false,
  layout = 'grid',
  width,
  height,
  children,
  onDragEnd,
  onResize
}: StickyNoteWrapperProps) {
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

  if (layout === 'grid' || layout === 'masonry') {
    return (
      <motion.div
        drag={isDraggable}
        dragMomentum={false}
        dragConstraints={{ left: 0, top: 0, right: window.innerWidth - width, bottom: window.innerHeight - height }}
        onDragEnd={onDragEnd}
        initial={false}
        animate={{
          x: position.x,
          y: position.y,
        }}
        className="absolute"
      >
        <ResizableBox
          width={width}
          height={height}
          onResize={onResize}
          minConstraints={[200, 200]}
          maxConstraints={[500, 500]}
          resizeHandles={['se']}
          handle={
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center">
              <Grip className="h-3 w-3 text-muted-foreground/40" />
            </div>
          }
        >
          <div className={cn(
            "border shadow-lg group relative overflow-hidden transition-all duration-300",
            getColorClass(note.color),
            isDraggable ? "cursor-grab active:cursor-grabbing" : "",
            "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent",
            "after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-8 after:bg-gradient-to-br",
            "after:from-black/0 after:to-black/5 after:rounded-tl-2xl",
            "hover:shadow-xl hover:scale-[1.02]",
            "rounded-lg p-6"
          )}>
            {children}
          </div>
        </ResizableBox>
      </motion.div>
    );
  }

  return (
    <div className={cn(
      "border shadow-lg group relative overflow-hidden transition-all duration-300",
      getColorClass(note.color),
      "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent",
      "after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-8 after:bg-gradient-to-br",
      "after:from-black/0 after:to-black/5 after:rounded-tl-2xl",
      "hover:shadow-xl hover:scale-[1.02]",
      layout === 'list' ? "flex items-start gap-4 rounded-lg p-4" : "rounded-lg p-6"
    )}>
      {children}
    </div>
  );
}
