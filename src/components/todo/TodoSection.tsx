import { ListTodo } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { Todo } from "@/types/todo";

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
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
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

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {todos?.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}