import { StickyNoteIcon } from "lucide-react";
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
      orange: 'sticky-note-orange',
    };
    return colorMap[colorValue] || 'sticky-note-yellow';
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col notes-section">
      <div className="flex items-center gap-3 text-primary">
        <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
          <StickyNoteIcon className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">Notes</h2>
      </div>

      <NotesInput
        newNote={newNote}
        selectedColor={selectedColor}
        colors={colors}
        onNoteChange={onNoteChange}
        onColorChange={onColorChange}
        onAdd={onAdd}
      />

      <ScrollArea className="flex-1 pr-4">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <StickyNote
                key={note.id}
                note={note}
                colorClass={getColorClass(note.color)}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
          {notes.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground py-12 col-span-full"
            >
              <StickyNoteIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Aucune note pour le moment</p>
              <p className="text-sm text-muted-foreground mt-2">
                Créez votre première note en utilisant le formulaire ci-dessus
              </p>
            </motion.div>
          )}
        </motion.div>
      </ScrollArea>
    </div>
  );
}