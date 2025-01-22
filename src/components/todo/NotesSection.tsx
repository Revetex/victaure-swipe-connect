import { StickyNoteIcon } from "lucide-react";
import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { ColorOption, StickyNote as StickyNoteType } from "@/types/todo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface NotesSectionProps {
  notes?: StickyNoteType[];
  newNote?: string;
  selectedColor?: string;
  colors?: ColorOption[];
  onNoteChange?: (value: string) => void;
  onColorChange?: (color: string) => void;
  onAdd?: () => void;
  onDelete?: (id: string) => void;
}

export function NotesSection({
  notes = [],
  newNote = "",
  selectedColor = "yellow",
  colors = [],
  onNoteChange = () => {},
  onColorChange = () => {},
  onAdd = () => {},
  onDelete = () => {},
}: NotesSectionProps) {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 text-primary">
        <div className="p-2 rounded-full bg-primary/10">
          <StickyNoteIcon className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-semibold">Notes</h2>
      </div>

      <div className="mt-4">
        <NotesInput
          newNote={newNote}
          selectedColor={selectedColor}
          colors={colors}
          onNoteChange={onNoteChange}
          onColorChange={onColorChange}
          onAdd={onAdd}
        />
      </div>

      <ScrollArea className="flex-1 mt-4">
        <motion.div 
          className={cn(
            "grid gap-3",
            isMobile ? "grid-cols-1" : "grid-cols-2"
          )}
          layout
        >
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <StickyNote
                key={note.id}
                note={note}
                colorClass={`sticky-note-${note.color}`}
                onDelete={onDelete}
              />
            ))}
            {notes.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "text-center text-muted-foreground py-6 col-span-full",
                  "bg-muted/30 rounded-lg"
                )}
              >
                <StickyNoteIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Aucune note pour le moment</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
    </div>
  );
}