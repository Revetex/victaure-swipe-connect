import { StickyNote } from "./StickyNote";
import { NotesInput } from "./NotesInput";

export interface NotesSectionProps {
  notes: Array<{
    id: string;
    text: string;
    color: string;
  }>;
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
  onDelete,
}: NotesSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Notes</h2>
      <NotesInput
        newNote={newNote}
        selectedColor={selectedColor}
        colors={colors}
        onNoteChange={onNoteChange}
        onColorChange={onColorChange}
        onAdd={onAdd}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onDelete={() => onDelete(note.id)}
          />
        ))}
      </div>
    </div>
  );
}