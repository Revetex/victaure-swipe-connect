import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { TodoSection } from "@/components/todo/TodoSection";
import { NotesSection } from "@/components/todo/NotesSection";
import { Separator } from "@/components/ui/separator";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";

export function ToolsSection() {
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
  } = useTodoList();

  const {
    notes,
    newNote,
    selectedColor,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote
  } = useNotes();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-2xl font-semibold">Outils de Productivité</h2>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 hover:bg-primary/20 transition-colors">
              <Info className="h-4 w-4 text-primary" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Gérez vos tâches et prenez des notes pour rester organisé et productif.
              </p>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>Créez et organisez vos tâches</li>
                <li>Prenez des notes rapides</li>
                <li>Suivez votre progression</li>
              </ul>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Tâches</h3>
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 hover:bg-primary/20 transition-colors">
                  <Info className="h-3 w-3 text-primary" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm text-muted-foreground">
                  Gérez vos tâches quotidiennes, définissez des priorités et suivez votre progression.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <TodoSection 
            todos={todos}
            newTodo={newTodo}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            allDay={allDay}
            onTodoChange={setNewTodo}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onAllDayChange={setAllDay}
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Notes</h3>
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 hover:bg-primary/20 transition-colors">
                  <Info className="h-3 w-3 text-primary" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-sm text-muted-foreground">
                  Prenez des notes rapides et gardez vos idées importantes à portée de main.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <NotesSection 
            notes={notes}
            newNote={newNote}
            selectedColor={selectedColor}
            onNoteChange={setNewNote}
            onColorChange={setSelectedColor}
            onAdd={addNote}
            onDelete={deleteNote}
          />
        </div>
      </div>
    </motion.div>
  );
}