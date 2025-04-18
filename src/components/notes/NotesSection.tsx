
import { useNotes } from "@/hooks/useNotes";
import { NotesToolbar } from "./NotesToolbar";
import { NoteGrid } from "@/components/board/NoteGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function NotesSection() {
  const isMobile = useIsMobile();
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
    <div className="h-screen flex flex-col pt-16 py-0">
      <NotesToolbar 
        newNote={newNote}
        selectedColor={selectedColor}
        colors={colors}
        onNoteChange={setNewNote}
        onColorChange={setSelectedColor}
        onAdd={addNote}
      />
      <div className="flex-1 overflow-hidden notes-container relative">
        <NoteGrid 
          notes={notes}
          onDeleteNote={deleteNote}
        />
      </div>
    </div>
  );
}
