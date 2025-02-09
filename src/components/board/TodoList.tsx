import { motion, AnimatePresence } from "framer-motion";
import { ListTodo } from "lucide-react";
import { TodoItem } from "../todo/TodoItem";
import { Todo } from "@/types/todo";

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

export function TodoList({ todos, onToggleTodo, onDeleteTodo }: TodoListProps) {
  return (
    <motion.div layout className="space-y-3 max-w-3xl mx-auto">
      <AnimatePresence mode="popLayout">
        {todos?.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggleTodo}
            onDelete={onDeleteTodo}
          />
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