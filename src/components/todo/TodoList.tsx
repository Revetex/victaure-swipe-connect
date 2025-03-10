import { ScrollArea } from "@/components/ui/scroll-area";
import { Todo } from "@/types/todo";
import { TodoItem } from "./TodoItem";
import { motion, AnimatePresence } from "framer-motion";
import { ListTodo } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <motion.div layout className="space-y-3 max-w-3xl mx-auto">
          <AnimatePresence mode="popLayout">
            {todos?.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
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
      </div>
    </ScrollArea>
  );
}