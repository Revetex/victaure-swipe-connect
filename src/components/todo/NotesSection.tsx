import { StickyNote as StickyNoteIcon } from "lucide-react";
import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { ColorOption, StickyNote as StickyNoteType } from "@/types/todo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

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
  const getColorClass = (colorValue: string) => {
    const colorMap: { [key: string]: string } = {
      yellow: 'sticky-note-yellow',
      blue: 'sticky-note-blue',
      green: 'sticky-note-green',
      pink: 'sticky-note-pink',
      purple: 'sticky-note-purple',
      peach: 'sticky-note-peach',
      gray: 'sticky-note-gray',
      orange: 'sticky-note-orange',
    };
    return colorMap[colorValue] || 'sticky-note-yellow';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full min-h-[calc(100vh-2rem)] flex flex-col bg-background/30 backdrop-blur-sm rounded-lg p-4 md:p-6 shadow-lg border border-border/50"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
          <StickyNoteIcon className="h-6 w-6 text-accent" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">Notes</h2>
      </div>

      <NotesInput
        newNote={newNote}
        selectedColor={selectedColor}
        colors={colors}
        onNoteChange={onNoteChange}
        onColorChange={onColorChange}
        onAdd={onAdd}
      />

      <ScrollArea className="flex-1 mt-6 pr-4">
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <StickyNote
                  note={note}
                  colorClass={getColorClass(note.color)}
                  onDelete={onDelete}
                />
              </motion.div>
            ))}
            {notes.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-12 col-span-full rounded-lg bg-accent/5"
              >
                Aucune note pour le moment
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
    </motion.div>
  );
}