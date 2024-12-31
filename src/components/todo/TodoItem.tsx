import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";
import { Todo } from "@/types/todo";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-lg transition-all duration-200",
      "bg-background/50 hover:bg-background shadow-sm hover:shadow",
      "border border-border/50 hover:border-border",
      "group animate-in slide-in-from-left"
    )}>
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="data-[state=checked]:bg-primary"
      />
      <div className="flex-1 min-w-0">
        <span className={cn(
          "block transition-colors",
          todo.completed && "line-through text-muted-foreground",
          !todo.completed && "group-hover:text-primary"
        )}>
          {todo.text}
        </span>
        {(todo.dueDate || todo.dueTime) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>
              {todo.dueDate && `Pour le ${format(todo.dueDate, 'dd/MM/yyyy', { locale: fr })}`}
              {todo.dueTime && !todo.allDay && ` à ${todo.dueTime}`}
              {todo.allDay && " (toute la journée)"}
            </span>
          </div>
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