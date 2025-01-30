import { ListTodo, StickyNote } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { NotesInput } from "./NotesInput";
import { StickyNote as StickyNoteComponent } from "./StickyNote";
import { Todo, StickyNote as StickyNoteType, ColorOption } from "@/types/todo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TodoSectionProps {
  todos: Todo[];
  notes: StickyNoteType[];
  newTodo: string;
  newNote: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay?: boolean;
  selectedColor?: string;
  colors?: ColorOption[];
  onTodoChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time?: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onColorChange: (color: string) => void;
  onAddTodo: () => void;
  onAddNote: () => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export function TodoSection({
  todos,
  notes,
  newTodo,
  newNote,
  selectedDate,
  selectedTime,
  allDay,
  selectedColor = "yellow",
  colors = [],
  onTodoChange,
  onNoteChange,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onColorChange,
  onAddTodo,
  onAddNote,
  onToggleTodo,
  onDeleteTodo,
  onDeleteNote,
}: TodoSectionProps) {
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-12rem)]">
      <Tabs defaultValue="todos" className="w-full h-full">
        <div className="flex items-center justify-between gap-3 text-primary p-4 sm:p-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10 border-b">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="todos" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              <span>Tâches</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              <span>Notes</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="todos" className="flex-1 h-full">
          <div className="p-4 sm:p-6 bg-background/50 backdrop-blur-sm sticky top-[72px] z-10 border-b">
            <TodoInput
              newTodo={newTodo}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              allDay={allDay}
              onTodoChange={onTodoChange}
              onDateChange={onDateChange}
              onTimeChange={onTimeChange}
              onAllDayChange={onAllDayChange}
              onAdd={onAddTodo}
            />
          </div>

          <ScrollArea className="flex-1 p-4 sm:p-6">
            <motion.div 
              className="space-y-3"
              layout
            >
              <AnimatePresence mode="popLayout">
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggleTodo}
                    onDelete={onDeleteTodo}
                  />
                ))}
                {todos.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-muted-foreground py-12 bg-background/50 rounded-lg"
                  >
                    <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Aucune tâche pour le moment</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Créez votre première tâche en utilisant le formulaire ci-dessus
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="notes" className="flex-1 h-full">
          <div className="p-4 sm:p-6 bg-background/50 backdrop-blur-sm sticky top-[72px] z-10 border-b">
            <NotesInput
              newNote={newNote}
              selectedColor={selectedColor}
              colors={colors}
              onNoteChange={onNoteChange}
              onColorChange={onColorChange}
              onAdd={onAddNote}
            />
          </div>

          <ScrollArea className="flex-1">
            <motion.div 
              className={cn(
                "grid gap-4 p-4 sm:p-6",
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                "min-h-[300px]"
              )}
              layout
            >
              <AnimatePresence mode="popLayout">
                {notes.map((note) => (
                  <StickyNoteComponent
                    key={note.id}
                    note={note}
                    colorClass={`sticky-note-${note.color}`}
                    onDelete={onDeleteNote}
                  />
                ))}
                {notes.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "text-center text-muted-foreground py-12 col-span-full",
                      "bg-background/50 rounded-lg"
                    )}
                  >
                    <StickyNote className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Aucune note pour le moment</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Créez votre première note en utilisant le formulaire ci-dessus
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}