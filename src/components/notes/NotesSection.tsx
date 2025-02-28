
import { useNotes } from "@/hooks/useNotes";
import { NotesToolbar } from "./NotesToolbar";
import { NoteGrid } from "@/components/board/NoteGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

  const colors = [
    { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
    { value: "blue", label: "Bleu", class: "bg-blue-200" },
    { value: "green", label: "Vert", class: "bg-green-200" },
    { value: "pink", label: "Rose", class: "bg-pink-200" },
    { value: "purple", label: "Violet", class: "bg-purple-200" },
    { value: "orange", label: "Orange", class: "bg-orange-200" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-screen flex flex-col pt-16 py-0"
    >
      <div className="bg-[#1B2A4A]/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-[#64B5D9]/10 p-4">
        <NotesToolbar 
          newNote={newNote}
          selectedColor={selectedColor}
          colors={colors}
          onNoteChange={setNewNote}
          onColorChange={setSelectedColor}
          onAdd={addNote}
        />
      </div>
      
      <div className="flex-1 overflow-hidden notes-container relative bg-[#1A1F2C]/50">
        <ScrollArea className="h-full w-full p-4">
          <motion.div layout>
            <NoteGrid 
              notes={notes}
              onDeleteNote={deleteNote}
              onUpdateNote={updateNote}
              isDraggable={!isMobile}
            />
          </motion.div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
