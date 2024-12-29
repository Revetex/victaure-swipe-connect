import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg glass-card group animate-in slide-in-from-left duration-300">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="data-[state=checked]:bg-primary"
      />
      <div className="flex-1">
        <span className={`block ${
          todo.completed 
            ? "line-through text-muted-foreground" 
            : "group-hover:text-primary transition-colors"
        }`}>
          {todo.text}
        </span>
        {(todo.dueDate || todo.dueTime) && (
          <span className="text-xs text-muted-foreground">
            {todo.dueDate && `Pour le ${format(todo.dueDate, 'dd/MM/yyyy', { locale: fr })}`}
            {todo.allDay 
              ? " (toute la journée)" 
              : todo.dueTime && ` à ${todo.dueTime}`
            }
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}