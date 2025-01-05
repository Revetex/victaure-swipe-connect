import { motion } from "framer-motion";
import { useNotes } from "@/hooks/useNotes";
import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { ScrollArea } from "../ui/scroll-area";

export function NotesSection() {
  const {
    notes,
    newNote,
    selectedColor,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote
  } = useNotes();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white/90">Mes notes</h2>
      
      <NotesInput
        value={newNote}
        onChange={setNewNote}
        onSubmit={addNote}
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />

      <ScrollArea className="h-[400px] pr-4">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          layout
        >
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              onDelete={() => deleteNote(note.id)}
            />
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
}