
import { StickyNote } from "@/types/todo";
import { NotesGrid } from "@/components/board/NoteGrid";
import { NotesToolbar } from "./NotesToolbar";

interface NotesSectionProps {
  notes: StickyNote[];
  newNote: string;
  selectedColor: string;
  colors: { value: string; label: string; }[];
  onNoteChange: (value: string) => void;
  onColorChange: (value: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdate?: (note: StickyNote) => void;
}

export function NotesSection({
  notes,
  newNote,
  selectedColor,
  colors,
  onNoteChange,
  onColorChange,
  onAdd,
  onDelete,
  onUpdate
}: NotesSectionProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <NotesToolbar
        newNote={newNote}
        selectedColor={selectedColor}
        colors={colors}
        onNoteChange={onNoteChange}
        onColorChange={onColorChange}
        onAdd={onAdd}
      />
      <div className="flex-1 relative">
        <NotesGrid 
          notes={notes} 
          onDeleteNote={onDelete}
          onUpdateNote={onUpdate}
          isDraggable
        />
      </div>
    </div>
  );
}
