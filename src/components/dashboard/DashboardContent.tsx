import { useState } from "react";
import { NotesSection } from "./NotesSection";

export function DashboardContent() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");

  const handleAddNote = () => {
    if (newNote.trim()) {
      const newNoteObj = {
        id: crypto.randomUUID(),
        text: newNote,
        color: selectedColor,
      };
      setNotes((prevNotes) => [...prevNotes, newNoteObj]);
      setNewNote("");
    }
  };

  const handleDeleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  return (
    <div className="space-y-6 p-6">
      <NotesSection
        notes={notes}
        newNote={newNote}
        selectedColor={selectedColor}
        onNoteChange={setNewNote}
        onColorChange={setSelectedColor}
        onAdd={handleAddNote}
        onDelete={handleDeleteNote}
      />
    </div>
  );
}
