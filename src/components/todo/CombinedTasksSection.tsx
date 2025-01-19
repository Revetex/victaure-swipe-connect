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

interface CombinedTasksSectionProps {
  todoProps: any;
  noteProps: any;
}

export function CombinedTasksSection({
  todoProps,
  noteProps
}: CombinedTasksSectionProps) {
  const isMobile = useIsMobile();
  const [currentTab, setCurrentTab] = useState("tasks");
  
  const {
    todos,
    newTodo,
    selectedDate,
    selectedTime,
    allDay,
    setNewTodo,
    setSelectedDate,
    setSelectedTime,
    setAllDay,
    addTodo,
    toggleTodo,
    deleteTodo
  } = todoProps;

  const {
    notes,
    newNote,
    selectedColor,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote,
    colors
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
                {todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                  />
                ))}
                {todos.length === 0 && (
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
                {notes.map((note) => (
                  <StickyNote
                    key={note.id}
                    note={note}
                    colorClass={`sticky-note-${note.color}`}
                    onDelete={deleteNote}
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
        </div>
      </TabsContent>
    </Tabs>
  );
}