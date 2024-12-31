import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { useNotes } from "@/hooks/useNotes";
import { motion } from "framer-motion";

export function NotesSection() {
  const { notes, addNote, deleteNote } = useNotes();

  return (
    <motion.div 
      className="h-full flex flex-col gap-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <NotesInput onAdd={addNote} />
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}