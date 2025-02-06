
import { AnimatePresence } from "framer-motion";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { EmptyNoteState } from "./note-grid/EmptyNoteState";
import { NoteGridContainer } from "./note-grid/NoteGridContainer";

interface NoteGridProps {
  notes: StickyNoteType[];
  onDeleteNote: (id: string) => void;
}

export function NoteGrid({ notes, onDeleteNote }: NoteGridProps) {
  return (
    <div className="w-full p-4">
      <AnimatePresence mode="popLayout">
        {notes && notes.length > 0 ? (
          <NoteGridContainer notes={notes} onDeleteNote={onDeleteNote} />
        ) : (
          <EmptyNoteState />
        )}
      </AnimatePresence>
    </div>
  );
}

