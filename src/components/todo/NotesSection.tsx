import { motion } from "framer-motion";
import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { ScrollArea } from "../ui/scroll-area";
import { StickyNote as StickyNoteType } from "@/types/todo";

interface NotesSectionProps {
  notes: StickyNoteType[];
  newNote: string;
  selectedColor: string;
  onNoteChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export function NotesSection({
  notes,
  newNote,
  selectedColor,
  onNoteChange,
  onColorChange,
  onAdd,
  onDelete
}: NotesSectionProps) {
  const colors = [
    { value: 'yellow', label: 'Jaune', class: 'bg-yellow-200' },
    { value: 'blue', label: 'Bleu', class: 'bg-blue-200' },
    { value: 'green', label: 'Vert', class: 'bg-green-200' },
    { value: 'pink', label: 'Rose', class: 'bg-pink-200' },
    { value: 'purple', label: 'Violet', class: 'bg-purple-200' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-200' },
  ];

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