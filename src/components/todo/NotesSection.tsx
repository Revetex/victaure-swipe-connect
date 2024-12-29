import { StickyNote as StickyNoteIcon } from "lucide-react";
import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { ColorOption, StickyNote as StickyNoteType } from "@/types/todo";

interface NotesSectionProps {
  notes: StickyNoteType[];
  newNote: string;
  selectedColor: string;
  colors: ColorOption[];
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
      <div className="flex items-center gap-2 text-primary">
        <StickyNoteIcon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Notes</h2>
      </div>

      <NotesInput
        newNote={newNote}
        selectedColor={selectedColor}
        colors={colors}
        onNoteChange={onNoteChange}
        onColorChange={onColorChange}
        onAdd={onAdd}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
        {notes?.map((note) => {
          const colorClass = colors.find(c => c.value === note.color)?.class || "bg-yellow-200";
          return (
            <StickyNote
              key={note.id}
              note={note}
              colorClass={colorClass}
              onDelete={onDelete}
            />
          );
        })}
      </div>
    </div>
  );
}