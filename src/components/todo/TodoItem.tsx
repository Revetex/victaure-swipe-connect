
import { Task } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  task: Task;
  onToggle: (taskId: string, completed: boolean) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

export function TodoItem({ task, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-2 py-2">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id, task.completed)}
      />
      <span className={cn(
        "flex-1",
        task.completed && "line-through text-muted-foreground"
      )}>
        {task.text}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
        className="text-destructive hover:text-destructive/90"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
