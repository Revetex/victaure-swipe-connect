
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
              "bg-[#2A3441]/80 backdrop-blur-lg",
              "rounded-xl",
              "border border-white/10",
              "shadow-lg shadow-black/10",
              "hover:shadow-xl hover:shadow-purple-500/10",
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
                  <CheckCircle className="h-6 w-6 text-purple-400" />
                ) : (
                  <Circle className="h-6 w-6 text-[#F2EBE4]/40 hover:text-purple-400/80 transition-colors" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm sm:text-base",
                  "text-[#F2EBE4]",
                  task.completed && "line-through text-[#F2EBE4]/40"
                )}>
                  {task.text}
                </p>
                {task.dueDate && (
                  <p className="text-xs text-[#F2EBE4]/60 mt-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(task.dueDate), 'PPP', { locale: fr })}
                  </p>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-[#F2EBE4]/60"
        >
          Aucune tâche pour le moment
        </motion.div>
      )}
    </div>
  );
}
