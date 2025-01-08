import { motion } from "framer-motion";
import { Trash2, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Todo } from "@/types/todo";
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
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group flex items-start gap-3 p-4 rounded-lg transition-all duration-200",
        "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md",
        "border border-primary/5 hover:border-primary/10"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="mt-1"
      />
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium text-foreground line-clamp-2",
          todo.completed && "line-through text-muted-foreground"
        )}>
          {todo.text}
        </p>
        
        {(todo.due_date || todo.due_time) && (
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            {todo.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {format(new Date(todo.due_date), "d MMMM yyyy", { locale: fr })}
                </span>
              </div>
            )}
            {!todo.all_day && todo.due_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{todo.due_time}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </motion.div>
  );
}