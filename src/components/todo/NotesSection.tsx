import { useState } from "react";
import { StickyNote } from "./StickyNote";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";

export interface NotesSectionProps {
  notes: any[];
  newNote: string;
  selectedColor: string;
  onNoteChange: Dispatch<SetStateAction<string>>;
  onColorChange: Dispatch<SetStateAction<string>>;
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
      <div className="flex gap-2">
        <Input
          value={newNote}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Add a new note..."
          className="flex-1"
        />
        <div className="flex gap-1">
          {colors.map((color) => (
            <button
              key={color.value}
              onClick={() => onColorChange(color.value)}
              className={`w-6 h-6 rounded-full ${color.class} ${
                selectedColor === color.value ? "ring-2 ring-offset-2" : ""
              }`}
            />
          ))}
        </div>
        <Button onClick={onAdd}>Add</Button>
      </div>
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