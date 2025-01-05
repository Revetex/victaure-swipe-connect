import { useState } from "react";
import { StickyNote } from "../todo/StickyNote";
import { NotesInput } from "../todo/NotesInput";

export interface NotesSectionProps {
  notes: any[];
  newNote: string;
  selectedColor: string;
  onNoteChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const colors = [
  { value: "yellow", label: "Yellow", class: "bg-yellow-200" },
  { value: "blue", label: "Blue", class: "bg-blue-200" },
  { value: "green", label: "Green", class: "bg-green-200" },
  { value: "pink", label: "Pink", class: "bg-pink-200" },
];

export function NotesSection({
  notes,
  newNote,
  selectedColor,
  onNoteChange,
  onColorChange,
  onAdd,
  onDelete,
}: NotesSectionProps) {
  return (
    <div className="space-y-4">
      <NotesInput
        newNote={newNote}
        selectedColor={selectedColor}
        colors={colors}
        onNoteChange={onNoteChange}
        onColorChange={onColorChange}
        onAdd={onAdd}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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