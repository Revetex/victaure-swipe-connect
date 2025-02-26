
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
    deleteNote,
    updateNote
  } = useNotes();

  const colors = [{
    value: "yellow",
    label: "Jaune",
    class: "bg-yellow-200"
  }, {
    value: "blue",
    label: "Bleu",
    class: "bg-blue-200"
  }, {
    value: "green",
    label: "Vert",
    class: "bg-green-200"
  }, {
    value: "purple",
    label: "Violet",
    class: "bg-purple-200"
  }, {
    value: "orange",
    label: "Orange",
    class: "bg-orange-200"
  }];

  return (
    <div className="relative h-full w-full flex flex-col bg-[#1B2A4A] text-[#F2EBE4]">
      {/* Background gradient decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/5 pointer-events-none" />

      <div className="flex-none z-10">
        <NotesToolbar 
          newNote={newNote} 
          selectedColor={selectedColor} 
          colors={colors} 
          onNoteChange={setNewNote} 
          onColorChange={setSelectedColor} 
          onAdd={addNote} 
        />
      </div>

      <ScrollArea className="flex-1 relative notes-container overflow-hidden">
        <NoteGrid 
          notes={notes} 
          onDeleteNote={deleteNote}
          onUpdateNote={updateNote}
          isDraggable={!isMobile}
        />
      </ScrollArea>
    </div>
  );
}
