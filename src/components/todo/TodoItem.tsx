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
      "flex items-start gap-3 p-4 rounded-lg",
      "bg-background/50 dark:bg-gray-800/50",
      "border border-border/50 hover:border-border",
      "group animate-in slide-in-from-left",
      "sm:items-center", // Centré sur desktop, aligné en haut sur mobile
      "touch-manipulation", // Améliore la réponse tactile
    )}>
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className={cn(
          "data-[state=checked]:bg-primary",
          "h-5 w-5 sm:h-4 sm:w-4", // Plus grand sur mobile
          "mt-1 sm:mt-0" // Ajustement vertical sur mobile
        )}
      />
      <div className="flex-1 min-w-0 space-y-1">
        <span className={cn(
          "block transition-colors text-base sm:text-sm", // Plus grand sur mobile
          "break-words", // Meilleure gestion des longs textes
          todo.completed && "line-through text-muted-foreground",
          !todo.completed && "group-hover:text-primary"
        )}>
          {todo.text}
        </span>
        {(todo.dueDate || todo.dueTime) && (
          <div className="flex items-center gap-1 text-sm sm:text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
            <span>
              {todo.dueDate && `Pour le ${format(todo.dueDate, 'dd/MM/yyyy', { locale: fr })}`}
              {todo.dueTime && ` à ${todo.dueTime}`}
            </span>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(todo.id)}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive",
          "h-10 w-10 sm:h-8 sm:w-8", // Plus grand sur mobile
          "absolute right-2 sm:relative sm:right-0" // Positionnement ajusté sur mobile
        )}
      >
        <Trash2 className="h-5 w-5 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
}