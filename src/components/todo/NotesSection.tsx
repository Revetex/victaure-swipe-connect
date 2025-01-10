import { StickyNoteIcon, Calendar } from "lucide-react";
import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { ColorOption, StickyNote as StickyNoteType } from "@/types/todo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-primary">
          <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
            <StickyNoteIcon className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">Notes</h2>
        </div>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            "hover:bg-primary/10 active:bg-primary/20",
            "focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
        >
          <span className="sr-only">Toggle Calendar</span>
          <Calendar className="h-6 w-6" />
        </button>
      </div>

      <NotesInput
        newNote={newNote}
        selectedColor={selectedColor}
        colors={colors}
        onNoteChange={onNoteChange}
        onColorChange={onColorChange}
        onAdd={onAdd}
      />

      <div className="flex-1 flex gap-4">
        <ScrollArea className="flex-1 pr-4">
          <motion.div 
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4",
              "min-h-[300px] bg-background/50 rounded-lg backdrop-blur-sm border",
              "shadow-inner"
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
                    "text-center text-muted-foreground py-12 col-span-full",
                    "bg-muted/30 rounded-lg backdrop-blur-sm",
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
          </motion.div>
        </ScrollArea>

        {showCalendar && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={cn(
              "w-full max-w-sm p-4",
              "bg-background/50 backdrop-blur-sm rounded-lg border",
              "shadow-lg hidden lg:block"
            )}
          >
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}