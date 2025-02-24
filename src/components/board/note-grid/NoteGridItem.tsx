
import { motion } from "framer-motion";
import { StickyNote } from "../../todo/StickyNote";
import { StickyNote as StickyNoteType } from "@/types/todo";

interface NoteGridItemProps {
  note: StickyNoteType;
  onDelete: (id: string) => void;
  onUpdate?: (note: StickyNoteType) => void;
  layout: 'grid' | 'masonry' | 'list';
}

export function NoteGridItem({ note, onDelete, onUpdate, layout }: NoteGridItemProps) {
  const handleUpdate = (updatedNote: StickyNoteType) => {
    if (onUpdate) {
      onUpdate(updatedNote);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={{ scale: layout === 'list' ? 1.01 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className="h-fit transform-gpu will-change-transform"
      style={{
        ...(layout === 'masonry' && { breakInside: 'avoid' })
      }}
    >
      <StickyNote
        note={note}
        onDelete={onDelete}
        onUpdate={handleUpdate}
        layout={layout}
      />
    </motion.div>
  );
}
