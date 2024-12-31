import { StickyNote as StickyNoteIcon } from "lucide-react";
import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { ColorOption, StickyNote as StickyNoteType } from "@/types/todo";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotesSectionProps {
  notes: StickyNoteType[];
  newNote: string;
  selectedColor: string;
  colors: ColorOption[];
  onNoteChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
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
  const getColorClass = (colorValue: string) => {
    switch (colorValue) {
      case 'yellow': return 'sticky-note-yellow';
      case 'blue': return 'sticky-note-blue';
      case 'green': return 'sticky-note-green';
      case 'pink': return 'sticky-note-pink';
      case 'purple': return 'sticky-note-purple';
      case 'peach': return 'sticky-note-peach';
      case 'gray': return 'sticky-note-gray';
      case 'orange': return 'sticky-note-orange';
      default: return 'sticky-note-yellow';
    }
  };

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

      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-4">
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              colorClass={getColorClass(note.color)}
              onDelete={onDelete}
            />
          ))}
          {notes.length === 0 && (
            <div className="text-center text-muted-foreground py-8 col-span-2">
              Aucune note pour le moment
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}