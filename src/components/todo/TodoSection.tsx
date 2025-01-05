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
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 h-full flex flex-col bg-background/50 rounded-lg p-6 shadow-lg border border-border/50"
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
          <ListTodo className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>

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

      <ScrollArea className="flex-1 pr-4">
        <AnimatePresence mode="popLayout">
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="mb-2"
            >
              <TodoItem
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            </motion.div>
          ))}
          {todos.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground py-8 rounded-lg bg-accent/5"
            >
              Aucune {type === 'notes' ? 'note' : 'tâche'} pour le moment
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  );
}