import { ListTodo } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { Todo } from "@/types/todo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

interface TodoSectionProps {
  todos: Todo[];
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay?: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time?: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onAdd: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  type?: 'notes' | 'tasks';
}

export function TodoSection({
  todos,
  newTodo,
  selectedDate,
  selectedTime,
  allDay,
  onTodoChange,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onAdd,
  onToggle,
  onDelete,
  type = 'tasks'
}: TodoSectionProps) {
  const title = type === 'notes' ? 'Notes' : 'Tâches';
  const sectionClass = type === 'notes' ? 'notes-section' : 'task-section';
  
  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-12rem)]">
      <div className="flex items-center gap-3 text-primary p-4 sm:p-6 bg-background/50 backdrop-blur-sm sticky top-0 z-10 border-b">
        <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
          <ListTodo className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

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
          onAdd={onAdd}
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
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </AnimatePresence>
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
        </motion.div>
      </ScrollArea>
    </div>
  );
}