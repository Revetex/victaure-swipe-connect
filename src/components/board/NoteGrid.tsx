
import { StickyNote } from "@/components/todo/StickyNote";
import type { StickyNote as StickyNoteType } from "@/types/todo";
import { cn } from "@/lib/utils";

interface NoteGridProps {
  notes: StickyNoteType[];
  onDeleteNote: (id: string) => void;
  onUpdateNote?: (note: StickyNoteType) => void;
  isDraggable?: boolean;
}

export function NoteGrid({ notes, onDeleteNote, onUpdateNote, isDraggable }: NoteGridProps) {
  return (
    <div className={cn(
      "relative min-h-full w-full p-4",
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      "gap-4 auto-rows-max"
    )}>
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          onDelete={onDeleteNote}
          onUpdate={onUpdateNote}
          isDraggable={false} // Désactivé temporairement pour fixer le layout
          layout="grid"
        />
      ))}
      {notes.length === 0 && (
        <div className="col-span-full flex items-center justify-center h-32 text-[#F2EBE4]/60">
          Aucune note pour le moment
        </div>
      )}
    </div>
  );
}
