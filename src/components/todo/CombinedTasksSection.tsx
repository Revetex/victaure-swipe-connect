import { ListTodo, StickyNote as StickyNoteIcon, Plus } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Todo, StickyNote as StickyNoteType, ColorOption } from "@/types/todo";

interface TodoProps {
  todos: Todo[];
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onAdd: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

interface NoteProps {
  notes: StickyNoteType[];
  newNote: string;
  selectedColor: string;
  onNoteChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  colors?: ColorOption[];
}

interface CombinedTasksSectionProps {
  todoProps: TodoProps;
  noteProps: NoteProps;
}

export function CombinedTasksSection({
  todoProps,
  noteProps
}: CombinedTasksSectionProps) {
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = useState("tasks");
  
  const {
    todos = [],
    newTodo,
    selectedDate,
    selectedTime,
    allDay,
    onTodoChange: setNewTodo,
    onDateChange: setSelectedDate,
    onTimeChange: setSelectedTime,
    onAllDayChange: setAllDay,
    onAdd: addTodo,
    onToggle: toggleTodo,
    onDelete: deleteTodo
  } = todoProps;

  const {
    notes = [],
    newNote,
    selectedColor,
    onNoteChange: setNewNote,
    onColorChange: setSelectedColor,
    onAdd: addNote,
    onDelete: deleteNote,
    colors = [
      { value: 'yellow', label: 'Jaune', class: 'bg-yellow-100' },
      { value: 'blue', label: 'Bleu', class: 'bg-blue-100' },
      { value: 'green', label: 'Vert', class: 'bg-green-100' },
      { value: 'pink', label: 'Rose', class: 'bg-pink-100' },
      { value: 'purple', label: 'Violet', class: 'bg-purple-100' },
      { value: 'orange', label: 'Orange', class: 'bg-orange-100' }
    ]
  } = noteProps;

  return (
    <Tabs 
      defaultValue="tasks" 
      className="h-full flex flex-col"
      onValueChange={setCurrentTab}
      value={currentTab}
    >
      <div className="flex items-center justify-between mb-6">
        <TabsList>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            <span>Tâches</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <StickyNoteIcon className="h-4 w-4" />
            <span>Notes</span>
          </TabsTrigger>
        </TabsList>

        <Button
          variant="outline"
          size="sm"
          onClick={() => (currentTab === "tasks" ? addTodo() : addNote())}
          className="hidden sm:flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter</span>
        </Button>
      </div>

      <TabsContent 
        value="tasks" 
        className="flex-1 mt-0"
        style={{ height: isMobile ? 'calc(100vh - 16rem)' : 'auto' }}
      >
        <div className="space-y-4 h-full flex flex-col">
          <TodoInput
            newTodo={newTodo}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            allDay={allDay}
            onTodoChange={setNewTodo}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onAllDayChange={setAllDay}
            onAdd={addTodo}
          />

          <ScrollArea className="flex-1">
            <motion.div 
              className={cn(
                "space-y-3 p-4 min-h-[300px]",
                "bg-background/50 rounded-lg backdrop-blur-sm border shadow-inner"
              )}
              layout
            >
              <AnimatePresence mode="popLayout">
                {Array.isArray(todos) && todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))}
                {(!Array.isArray(todos) || todos.length === 0) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-muted-foreground py-12"
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
        </div>
      </TabsContent>

      <TabsContent 
        value="notes" 
        className="flex-1 mt-0"
        style={{ height: isMobile ? 'calc(100vh - 16rem)' : 'auto' }}
      >
        <div className="space-y-4 h-full flex flex-col">
          <NotesInput
            newNote={newNote}
            selectedColor={selectedColor}
            colors={colors}
            onNoteChange={setNewNote}
            onColorChange={setSelectedColor}
            onAdd={addNote}
          />

          <ScrollArea className="flex-1">
            <motion.div 
              className={cn(
                "grid gap-4 p-4 min-h-[300px]",
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                "bg-background/50 rounded-lg backdrop-blur-sm border shadow-inner"
              )}
              layout
            >
              <AnimatePresence mode="popLayout">
                {Array.isArray(notes) && notes.map((note) => (
                  <StickyNote
                    key={note.id}
                    note={note}
                    colorClass={`sticky-note-${note.color}`}
                    onDelete={deleteNote}
                  />
                ))}
                {(!Array.isArray(notes) || notes.length === 0) && (
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
        </div>
      </TabsContent>
    </Tabs>
  );
}
