import { ListTodo } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { Todo } from "@/types/todo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";

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
    <Card className="h-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-primary/10">
      <div className="p-6 space-y-6 h-full flex flex-col">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/20">
            <ListTodo className="h-6 w-6 text-primary" />
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
    </Card>
  );
}