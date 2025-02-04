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
    deleteNote
  } = useNotes();

  const colors = [
    { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
    { value: "blue", label: "Bleu", class: "bg-blue-200" },
    { value: "green", label: "Vert", class: "bg-green-200" },
    { value: "pink", label: "Rose", class: "bg-pink-200" },
    { value: "purple", label: "Violet", class: "bg-purple-200" },
    { value: "orange", label: "Orange", class: "bg-orange-200" }
  ];

  return (
    <NotesSection
      notes={notes}
      newNote={newNote}
      selectedColor={selectedColor}
      colors={colors}
      onNoteChange={setNewNote}
      onColorChange={setSelectedColor}
      onAdd={addNote}
      onDelete={deleteNote}
    />
  );
}