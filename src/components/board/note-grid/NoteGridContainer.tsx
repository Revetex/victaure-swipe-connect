
import { motion } from "framer-motion";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { NoteGridItem } from "./NoteGridItem";
import { cn } from "@/lib/utils";

interface NoteGridContainerProps {
  notes: StickyNoteType[];
  onDeleteNote: (id: string) => void;
  layout: 'grid' | 'masonry' | 'list';
}

export function NoteGridContainer({ notes, onDeleteNote, layout }: NoteGridContainerProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        "gap-6 p-6",
        layout === 'grid' && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        layout === 'masonry' && "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 space-y-6",
        layout === 'list' && "flex flex-col space-y-4"
      )}
    >
      {notes.map((note) => (
        <NoteGridItem 
          key={note.id} 
          note={note} 
          onDelete={onDeleteNote}
          layout={layout}
        />
      ))}
    </motion.div>
  );
}
