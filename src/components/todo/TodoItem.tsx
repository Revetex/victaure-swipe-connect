import { Trash2, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/types/todo";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "todo-item group",
        "p-4 rounded-xl",
        "bg-white/50 dark:bg-gray-800/50",
        "border border-gray-200/50 dark:border-gray-700/50",
        "shadow-sm hover:shadow-md transition-all duration-300",
        "dark:text-gray-100",
        "flex items-center gap-3",
        todo.completed && "completed opacity-75"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className={cn(
          "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
          "h-5 w-5"
        )}
      />
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium transition-all",
          todo.completed && "line-through text-muted-foreground"
        )}>
          {todo.text}
        </p>
        
        {(todo.dueDate || todo.dueTime) && (
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
            {todo.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(todo.dueDate), "d MMMM yyyy", { locale: fr })}
                </span>
              </div>
            )}
            {!todo.allDay && todo.dueTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{todo.dueTime}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className={cn(
          "opacity-100 sm:opacity-0 group-hover:opacity-100",
          "transition-opacity",
          "hover:text-destructive",
          "h-8 w-8"
        )}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}