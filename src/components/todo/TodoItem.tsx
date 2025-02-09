
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Todo } from "@/types/todo";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const formattedDate = todo.dueDate 
    ? format(new Date(todo.dueDate), "d MMMM yyyy", { locale: fr })
    : null;

  const formattedTime = todo.dueTime 
    ? format(new Date(`2000-01-01T${todo.dueTime}`), "HH:mm")
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "group flex items-start gap-4 rounded-lg border p-4",
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "hover:shadow-md transition-all duration-200",
        "active:scale-[0.98] touch-none",
        todo.completed && "opacity-60"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="mt-1"
      />
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium leading-none",
          todo.completed && "line-through text-muted-foreground"
        )}>
          {todo.text}
        </p>
        
        {(formattedDate || formattedTime) && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {formattedDate && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1">
                {formattedDate}
              </span>
            )}
            {formattedTime && !todo.allDay && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1">
                {formattedTime}
              </span>
            )}
            {todo.allDay && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1">
                Toute la journée
              </span>
            )}
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        onClick={() => onDelete(todo.id)}
      >
        <Trash2 className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Supprimer</span>
      </Button>
    </motion.div>
  );
}
