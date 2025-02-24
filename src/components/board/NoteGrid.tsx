
import { AnimatePresence } from "framer-motion";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { EmptyNoteState } from "./note-grid/EmptyNoteState";
import { NoteGridContainer } from "./note-grid/NoteGridContainer";
import { useState } from "react";

interface NoteGridProps {
  notes: StickyNoteType[];
  onDeleteNote: (id: string) => void;
  onUpdateNote?: (note: StickyNoteType) => void;
}

export function NoteGrid({
  notes,
  onDeleteNote,
  onUpdateNote
}: NoteGridProps) {
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'list'>('grid');
  
  return (
    <div className="w-full space-y-4 p-4">
      <AnimatePresence mode="popLayout">
        {notes && notes.length > 0 ? (
          <NoteGridContainer 
            notes={notes} 
            onDeleteNote={onDeleteNote}
            onUpdateNote={onUpdateNote} 
            layout={layout}
          />
        ) : (
          <EmptyNoteState />
        )}
      </AnimatePresence>
    </div>
  );
}
