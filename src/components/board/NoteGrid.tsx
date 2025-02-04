import { motion, AnimatePresence } from "framer-motion";
import { StickyNote as StickyNoteIcon } from "lucide-react";
import { StickyNote } from "../todo/StickyNote";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { cn } from "@/lib/utils";

interface NoteGridProps {
  notes: StickyNoteType[];
  onDeleteNote: (id: string) => void;
}

export function NoteGrid({ notes, onDeleteNote }: NoteGridProps) {
  return (
    <motion.div 
      layout 
      className={cn(
        "grid gap-4 max-w-5xl mx-auto",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        "auto-rows-max"
      )}
    >
      <AnimatePresence mode="popLayout">
        {notes?.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            colorClass={`sticky-note-${note.color}`}
            onDelete={onDeleteNote}
          />
        ))}
        {(!notes || notes.length === 0) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground py-12 col-span-full"
          >
            <StickyNoteIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucune note</p>
            <p className="text-sm mt-2">
              Créez votre première note
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}