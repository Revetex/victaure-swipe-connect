import { StickyNote as StickyNoteIcon } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { StickyNote } from "./StickyNote";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Todo } from "@/types/todo";

interface TodoSectionProps {
  todos: Todo[];
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay?: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time?: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onAdd: () => void;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const colorClasses = [
  "bg-yellow-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-pink-100",
  "bg-purple-100",
  "bg-orange-100"
];

export function TodoSection({
  todos,
  newTodo,
  onTodoChange,
  onAdd,
  onDelete,
}: TodoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <StickyNoteIcon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Notes</h2>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex-grow relative">
          <TodoInput
            newTodo={newTodo}
            onTodoChange={onTodoChange}
            onAdd={onAdd}
          />
        </div>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {todos.map((todo, index) => (
            <StickyNote
              key={todo.id}
              note={{ id: todo.id, text: todo.text }}
              colorClass={colorClasses[index % colorClasses.length]}
              onDelete={onDelete}
            />
          ))}
          {todos.length === 0 && (
            <div className="text-center text-muted-foreground py-8 col-span-2">
              Aucune note pour le moment
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}