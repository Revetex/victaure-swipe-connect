
import { motion, AnimatePresence } from "framer-motion";
import { StickyNoteIcon } from "lucide-react";
import { StickyNote } from "../todo/StickyNote";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { cn } from "@/lib/utils";

interface NoteGridProps {
  notes: StickyNoteType[];
  onDeleteNote: (id: string) => void;
}

export function NoteGrid({ notes, onDeleteNote }: NoteGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full p-4">
      <AnimatePresence mode="popLayout">
        {notes && notes.length > 0 ? (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className={cn(
              "grid gap-6",
              "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
              "auto-rows-max"
            )}
          >
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="h-fit"
              >
                <StickyNote
                  note={note}
                  colorClass={`sticky-note-${note.color}`}
                  onDelete={onDeleteNote}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[200px] text-center"
          >
            <StickyNoteIcon className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Aucune note</p>
            <p className="text-sm text-muted-foreground mt-2">
              Créez votre première note en utilisant le formulaire ci-dessus
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
