
import { motion, AnimatePresence } from "framer-motion";
import { ListTodo, Calendar, Clock } from "lucide-react";
import { TodoItem } from "../todo/TodoItem";
import { Todo } from "@/types/todo";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export function TodoList({ todos, onToggleTodo, onDeleteTodo }: TodoListProps) {
  const formatDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: fr });
  };

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <motion.div layout className="space-y-3 max-w-3xl mx-auto">
      <AnimatePresence mode="popLayout">
        {todos?.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card/50 backdrop-blur p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggleTodo}
              onDelete={onDeleteTodo}
            />
            {todo.date && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(todo.date)}</span>
                {!todo.allDay && todo.time && (
                  <>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{formatTime(todo.time)}</span>
                  </>
                )}
              </div>
            )}
          </motion.div>
        ))}
        {(!todos || todos.length === 0) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted-foreground py-12"
          >
            <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Aucune tâche</p>
            <p className="text-sm mt-2">
              Ajoutez votre première tâche
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
