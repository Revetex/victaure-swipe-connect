
import { StickyNote } from "@/components/todo/StickyNote";
import type { StickyNote as StickyNoteType } from "@/types/todo";

interface NoteGridProps {
  notes: StickyNoteType[];
  onDeleteNote: (id: string) => void;
  onUpdateNote?: (note: StickyNoteType) => void;
  isDraggable?: boolean;
}

export function NoteGrid({ notes, onDeleteNote, onUpdateNote, isDraggable }: NoteGridProps) {
  return (
    <div className="relative h-full w-full">
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          onDelete={onDeleteNote}
          onUpdate={onUpdateNote}
          isDraggable={isDraggable}
        />
      ))}
    </div>
  );
}
