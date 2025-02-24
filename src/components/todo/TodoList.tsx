
import { ScrollArea } from "@/components/ui/scroll-area";
import { Task } from "@/hooks/useTasks";
import { motion, AnimatePresence } from "framer-motion";
import { TodoItem } from "./TodoItem";

export interface TodoListProps {
  tasks: Task[];
  onToggleTask: (taskId: string, completed: boolean) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export function TodoList({ tasks, onToggleTask, onDeleteTask }: TodoListProps) {
  return (
    <ScrollArea className="h-[300px]">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <TodoItem
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </ScrollArea>
  );
}
