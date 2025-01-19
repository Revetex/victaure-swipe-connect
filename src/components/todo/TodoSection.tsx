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
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center gap-3 text-primary">
        <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
          <ListTodo className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
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

      <ScrollArea className="flex-1">
        <motion.div 
          className="space-y-3 p-4 min-h-[300px] bg-background/50 rounded-lg backdrop-blur-sm border shadow-inner"
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