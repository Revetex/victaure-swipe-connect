import { ListTodo, CalendarDays } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { CalendarView } from "./CalendarView";
import { Todo } from "@/types/todo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TodoSectionProps {
  todos: Todo[];
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  isAllDay: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time?: string) => void;
  onAllDayChange: (value: boolean) => void;
  onAdd: () => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoSection({
  todos,
  newTodo,
  selectedDate,
  selectedTime,
  isAllDay,
  onTodoChange,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onAdd,
  onToggle,
  onDelete,
}: TodoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <ListTodo className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Tâches</h2>
      </div>

      <TodoInput
        newTodo={newTodo}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        isAllDay={isAllDay}
        onTodoChange={onTodoChange}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        onAllDayChange={onAllDayChange}
        onAdd={onAdd}
      />

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendrier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarView todos={todos} onDateSelect={onDateChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}