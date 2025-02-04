import { StickyNoteIcon } from "lucide-react";
import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { ColorOption, StickyNote as StickyNoteType } from "@/types/todo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-12rem)]">
      <div className="p-4">
        <NotesInput
          newNote={newNote}
          selectedColor={selectedColor}
          colors={colors}
          onNoteChange={onNoteChange}
          onColorChange={onColorChange}
          onAdd={onAdd}
        />
      </div>

      <ScrollArea className="flex-1 relative">
        <div className="min-h-[600px] relative p-4">
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
                  "text-center text-muted-foreground py-12",
                  "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                  "bg-muted/30 rounded-lg backdrop-blur-sm w-64",
                  "border border-border/50"
                )}
              >
                <StickyNoteIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Aucune note pour le moment</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Créez votre première note en utilisant le formulaire ci-dessus
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}