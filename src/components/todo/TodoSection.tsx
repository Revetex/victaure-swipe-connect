import { ListTodo } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { Todo } from "@/types/todo";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TodoSectionProps {
  todos?: Todo[];
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay?: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time?: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onAdd: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  type?: 'notes' | 'tasks';
}

export function TodoSection({
  todos = [], // Provide default empty array
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
  type = 'tasks'
}: TodoSectionProps) {
  const title = type === 'notes' ? 'Notes' : 'Tâches';
  const sectionClass = type === 'notes' ? 'notes-section' : 'task-section';
  
  return (
    <div className={`space-y-4 h-full flex flex-col ${sectionClass}`}>
      <div className="flex items-center gap-2 text-primary">
        <ListTodo className="h-5 w-5" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <TodoInput
        newTodo={newTodo}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        allDay={allDay}
        onTodoChange={onTodoChange}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        onAllDayChange={onAllDayChange}
        onAdd={onAdd}
      />

      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-2">
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
              Aucune {type === 'notes' ? 'note' : 'tâche'} pour le moment
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}