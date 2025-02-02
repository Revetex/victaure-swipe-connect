import { Todo } from "@/types/todo";
import { TodoInput } from "./TodoInput";
import { TodoList } from "./TodoList";

interface TodoSectionProps {
  todos: Todo[];
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay?: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onAddTodo: () => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
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
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
}: TodoSectionProps) {
  return (
    <div className="h-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-12rem)]">
      <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm rounded-lg border border-border/50">
        <div className="p-4 sm:p-6 bg-background/50 backdrop-blur-sm sticky top-[72px] z-10 border-b">
          <TodoInput
            newTodo={newTodo}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            allDay={allDay}
            onTodoChange={onTodoChange}
            onDateChange={onDateChange}
            onTimeChange={onTimeChange}
            onAllDayChange={onAllDayChange}
            onAdd={onAddTodo}
          />
        </div>

        <div className="flex-1 overflow-hidden">
          <TodoList
            todos={todos}
            onToggle={onToggleTodo}
            onDelete={onDeleteTodo}
          />
        </div>
      </div>
    </div>
  );
}