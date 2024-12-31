import { ListTodo } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { Todo } from "@/types/todo";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { TimeSelector } from "./TimeSelector";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TodoSectionProps {
  todos: Todo[];
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time?: string) => void;
  onAllDayChange: (value: boolean) => void;
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
  onDelete
}: TodoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <ListTodo className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Tâches</h2>
      </div>

      <div className="space-y-4">
        <TodoInput
          newTodo={newTodo}
          onTodoChange={onTodoChange}
          onAdd={onAdd}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {!allDay && (
            <TimeSelector
              selectedTime={selectedTime}
              onTimeChange={onTimeChange}
            />
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allDay"
              checked={allDay}
              onCheckedChange={(checked) => {
                onAllDayChange(checked === true);
                if (checked) {
                  onTimeChange(undefined);
                }
              }}
            />
            <Label htmlFor="allDay">Toute la journée</Label>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-2 pr-4">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
            {todos.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Aucune tâche pour le moment
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}