
import { Task } from "@/types/tasks";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            layout
            className={cn(
              "group relative",
              "bg-white/50 dark:bg-gray-900/50",
              "backdrop-blur-lg",
              "rounded-xl",
              "border border-gray-200/50 dark:border-gray-700/50",
              "shadow-sm hover:shadow-md",
              "transition-all duration-200",
              "p-4"
            )}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => onToggleTask(task.id)}
                className="flex-shrink-0"
              >
                {task.completed ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm sm:text-base",
                  "text-gray-900 dark:text-gray-100",
                  task.completed && "line-through text-gray-500 dark:text-gray-400"
                )}>
                  {task.text}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(task.dueDate), 'PPP', { locale: fr })}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-500 dark:text-gray-400"
        >
          Aucune tâche pour le moment
        </motion.div>
      )}
    </div>
  );
}
