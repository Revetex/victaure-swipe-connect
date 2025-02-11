
import { motion } from "framer-motion";
import { StickyNote } from "../../todo/StickyNote";
import { StickyNote as StickyNoteType } from "@/types/todo";

interface NoteGridItemProps {
  note: StickyNoteType;
  onDelete: (id: string) => void;
}

export function NoteGridItem({ note, onDelete }: NoteGridItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className="h-fit transform-gpu will-change-transform"
    >
      <StickyNote
        note={note}
        colorClass={`sticky-note-${note.color}`}
        onDelete={onDelete}
      />
    </motion.div>
  );
}
