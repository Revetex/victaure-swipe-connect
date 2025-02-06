import { ScrollArea } from "@/components/ui/scroll-area";
import { Todo } from "@/types/todo";
import { TaskItem } from "./TaskItem";
import { motion, AnimatePresence } from "framer-motion";
import { ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ todos, onToggle, onDelete }: TaskListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="p-4">
        <motion.div layout className="space-y-3 max-w-3xl mx-auto">
          <AnimatePresence mode="popLayout">
            {todos?.map((todo) => (
              <TaskItem
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
                className={cn(
                  "text-center text-muted-foreground py-12",
                  "bg-muted/30 rounded-lg backdrop-blur-sm",
                  "border border-border/50"
                )}
              >
                <ListTodo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Aucune tâche</p>
                <p className="text-sm mt-2">
                  Ajoutez votre première tâche en utilisant le formulaire ci-dessus
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </ScrollArea>
  );
}