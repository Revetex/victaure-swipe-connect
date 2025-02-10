
import { motion } from "framer-motion";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { NoteGridItem } from "./NoteGridItem";
import { cn } from "@/lib/utils";

interface NoteGridContainerProps {
  notes: StickyNoteType[];
  onDeleteNote: (id: string) => void;
}

export function NoteGridContainer({ notes, onDeleteNote }: NoteGridContainerProps) {
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
        "grid gap-6 p-6",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        "auto-rows-max"
      )}
    >
      {notes.map((note) => (
        <NoteGridItem key={note.id} note={note} onDelete={onDeleteNote} />
      ))}
    </motion.div>
  );
}
