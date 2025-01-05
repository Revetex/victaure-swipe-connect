import { Todo } from "@/types/todo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TodoSectionProps {
  todos: Todo[];
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onAdd: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoSection({
  todos,
  newTodo,
  selectedDate,
  selectedTime,
  allDay,
  onTodoChange,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onAdd,
  onToggle,
  onDelete,
}: TodoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tâches</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nouvelle tâche..."
              value={newTodo}
              onChange={(e) => onTodoChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onAdd();
                }
              }}
            />
            <Button onClick={onAdd}>Ajouter</Button>
          </div>

          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: fr })
                  ) : (
                    <span>Choisir une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={onDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {!allDay && (
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => onTimeChange(e.target.value)}
                className="w-auto"
              />
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="all-day"
                checked={allDay}
                onCheckedChange={onAllDayChange}
              />
              <Label htmlFor="all-day">Toute la journée</Label>
            </div>
          </div>

          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-muted/50"
              >
                <button
                  onClick={() => onToggle(todo.id)}
                  className="flex items-center gap-2 flex-1"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <span
                    className={cn(
                      todo.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {todo.text}
                  </span>
                </button>
                {todo.dueDate && (
                  <span className="text-sm text-muted-foreground">
                    {format(todo.dueDate, "PPP", { locale: fr })}
                    {!todo.allDay && todo.dueTime && ` à ${todo.dueTime}`}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(todo.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}