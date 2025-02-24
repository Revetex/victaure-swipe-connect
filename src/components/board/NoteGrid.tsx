import { AnimatePresence } from "framer-motion";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { EmptyNoteState } from "./note-grid/EmptyNoteState";
import { NoteGridContainer } from "./note-grid/NoteGridContainer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
interface NoteGridProps {
  notes: StickyNoteType[];
  onDeleteNote: (id: string) => void;
}
export function NoteGrid({
  notes,
  onDeleteNote
}: NoteGridProps) {
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'list'>('grid');
  return <div className="w-full space-y-4 p-4">
      

      <AnimatePresence mode="popLayout">
        {notes && notes.length > 0 ? <NoteGridContainer notes={notes} onDeleteNote={onDeleteNote} layout={layout} /> : <EmptyNoteState />}
      </AnimatePresence>
    </div>;
}