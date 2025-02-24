
import { useNotes } from "@/hooks/useNotes";
import { NotesSection } from "@/components/todo/NotesSection";

export function NotesMap() {
  const {
    notes,
    newNote,
    selectedColor,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote,
    updateNote
  } = useNotes();

  const colors = [
    { value: "yellow", label: "Jaune" },
    { value: "blue", label: "Bleu" },
    { value: "green", label: "Vert" },
    { value: "purple", label: "Violet" },
    { value: "orange", label: "Orange" }
  ];

  return (
    <div className="h-screen flex flex-col pt-16">
      <div className="w-full max-w-3xl mx-auto space-y-4 px-2 sm:px-4">
        <NotesSection
          notes={notes}
          newNote={newNote}
          selectedColor={selectedColor}
          colors={colors}
          onNoteChange={setNewNote}
          onColorChange={setSelectedColor}
          onAdd={addNote}
          onDelete={deleteNote}
          onUpdate={updateNote}
        />
      </div>
    </div>
  );
}
