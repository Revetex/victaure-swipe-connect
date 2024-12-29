import { ListTodo } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { Todo } from "@/types/todo";
import { useTranslation } from "react-i18next";

interface TodoSectionProps {
  todos: Todo[];
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time?: string) => void;
  onAdd: () => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TodoSection({
  todos,
  newTodo,
  selectedDate,
  selectedTime,
  onTodoChange,
  onDateChange,
  onTimeChange,
  onAdd,
  onToggle,
  onDelete,
}: TodoSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <ListTodo className="h-5 w-5" />
        <h2 className="text-lg font-semibold">{t("todo.title")}</h2>
      </div>

      <TodoInput
        newTodo={newTodo}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        onTodoChange={onTodoChange}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        onAdd={onAdd}
      />

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {todos.length === 0 ? (
          <p className="text-center text-muted-foreground">{t("todo.noTasks")}</p>
        ) : (
          todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}