import { useNotes } from "@/hooks/useNotes";
import { NotesToolbar } from "@/components/notes/NotesToolbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { StickyNoteIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotesSection() {
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
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-12rem)]">
      <NotesToolbar
        newNote={newNote}
        selectedColor={selectedColor}
        colors={colors}
        onNoteChange={setNewNote}
        onColorChange={setSelectedColor}
        onAdd={addNote}
      />

      <ScrollArea className="flex-1 relative px-4">
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[600px] relative pb-4">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={cn(
                  "p-4 rounded-lg shadow-lg",
                  `bg-${note.color}-100`,
                  "hover:shadow-xl transition-all duration-300"
                )}
              >
                <p className="text-sm">{note.text}</p>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="mt-4 text-xs text-gray-500 hover:text-red-500"
                >
                  Supprimer
                </button>
              </motion.div>
            ))}
            {notes.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "text-center text-muted-foreground py-12",
                  "col-span-full",
                  "bg-muted/30 rounded-lg backdrop-blur-sm",
                  "border border-border/50 mx-auto w-64"
                )}
              >
                <StickyNoteIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Aucune note pour le moment</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Créez votre première note en utilisant le formulaire ci-dessus
                </p>
              </motion.div>
            )}
          </div>
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}