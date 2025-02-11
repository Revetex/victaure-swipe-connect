
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { type Task } from "@/hooks/useTasks";

interface TaskListProps {
  tasks?: Task[];
  onToggleTask: (taskId: string, completed: boolean) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="space-y-2">
        {tasks?.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(task.id, task.completed)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <div className="flex-1">
                  <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.text}
                  </span>
                  {task.due_date && (
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(task.due_date), "d MMMM yyyy", { locale: fr })}
                      {task.due_time && !task.all_day && ` à ${task.due_time}`}
                      {task.all_day && " (toute la journée)"}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTask(task.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
