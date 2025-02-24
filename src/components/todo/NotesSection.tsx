
import { useNotes } from "@/hooks/useNotes";
import { NotesToolbar } from "./NotesToolbar";
import { NoteGrid } from "@/components/board/NoteGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Move } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotesSection() {
  const isMobile = useIsMobile();
  const [isDraggable, setIsDraggable] = useState(false);
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
        <div className="flex items-center justify-between gap-2">
          <NotesToolbar
            newNote={newNote}
            selectedColor={selectedColor}
            colors={colors}
            onNoteChange={setNewNote}
            onColorChange={setSelectedColor}
            onAdd={addNote}
          />
          <Button
            variant={isDraggable ? "default" : "secondary"}
            size="icon"
            onClick={() => setIsDraggable(!isDraggable)}
            className={cn(
              "shrink-0",
              isDraggable && "bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
            )}
            title={isDraggable ? "Désactiver le déplacement" : "Activer le déplacement"}
          >
            <Move className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden notes-container relative">
        <NoteGrid 
          notes={notes} 
          onDeleteNote={deleteNote} 
          onUpdateNote={updateNote} 
          isDraggable={isDraggable}
        />
      </div>
    </div>
  );
}
