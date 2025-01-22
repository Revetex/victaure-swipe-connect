import { ListTodo } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { Todo } from "@/types/todo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex flex-col h-full ${sectionClass}`}>
      <div className="flex items-center gap-3 text-primary mb-4">
        <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
          <ListTodo className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className={`${isMobile ? 'sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4' : ''}`}>
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

      <ScrollArea className="flex-1 pr-4 mt-4">
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
              className="text-center text-muted-foreground py-8"
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