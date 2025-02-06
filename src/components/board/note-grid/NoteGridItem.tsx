
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
      key={note.id}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      className="h-fit"
    >
      <StickyNote
        note={note}
        colorClass={`sticky-note-${note.color}`}
        onDelete={onDelete}
      />
    </motion.div>
  );
}

