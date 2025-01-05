import { motion } from "framer-motion";
import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { ScrollArea } from "../ui/scroll-area";
import { StickyNote as StickyNoteType } from "@/types/todo";

export interface NotesSectionProps {
  notes: StickyNoteType[];
  newNote: string;
  selectedColor: string;
  colors: { value: string; label: string; class: string; }[];
  onNoteChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export function NotesSection({
  notes,
  newNote,
  selectedColor,
  colors,
  onNoteChange,
  onColorChange,
  onAdd,
  onDelete
}: NotesSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white/90">Mes notes</h2>
      
      <NotesInput
        newNote={newNote}
        selectedColor={selectedColor}
        colors={colors}
        onNoteChange={onNoteChange}
        onColorChange={onColorChange}
        onAdd={onAdd}
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
              onDelete={() => onDelete(note.id)}
            />
          ))}
        </motion.div>
      </ScrollArea>
    </div>
  );
}