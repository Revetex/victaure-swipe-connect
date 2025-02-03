import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ListTodo, StickyNote, Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { TodoSection } from "@/components/todo/TodoSection";
import { NotesSection } from "@/components/todo/NotesSection";
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

  const colors = [
    { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
    { value: "blue", label: "Bleu", class: "bg-blue-200" },
    { value: "green", label: "Vert", class: "bg-green-200" },
    { value: "red", label: "Rouge", class: "bg-red-200" },
    { value: "purple", label: "Violet", class: "bg-purple-200" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }} 
      className="w-full px-4"
    >
      <div className="w-full sm:max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-semibold">Outils de Productivité</h2>
          <HoverCard>
            <HoverCardTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 hover:bg-primary/20 transition-colors">
                <Info className="h-4 w-4 text-primary" />
              </button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-sm text-muted-foreground">
                Gérez efficacement vos tâches et prenez des notes pour rester organisé.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="tasks" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 hover:no-underline group">
              <div className="flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors" />
                <span className="font-semibold group-hover:text-primary/80 transition-colors">Tâches</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="h-[calc(100vh-16rem)] overflow-auto">
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
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="notes" className="border rounded-lg bg-card shadow-sm">
            <AccordionTrigger className="px-4 hover:no-underline group">
              <div className="flex items-center gap-2">
                <StickyNote className="h-5 w-5 text-primary group-hover:text-primary/80 transition-colors" />
                <span className="font-semibold group-hover:text-primary/80 transition-colors">Notes</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="h-[calc(100vh-16rem)] overflow-auto">
                <NotesSection
                  notes={notes}
                  newNote={newNote}
                  selectedColor={selectedColor}
                  colors={colors}
                  onNoteChange={setNewNote}
                  onColorChange={setSelectedColor}
                  onAdd={addNote}
                  onDelete={deleteNote}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.div>
  );
}