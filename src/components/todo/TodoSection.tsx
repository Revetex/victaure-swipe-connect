import { Todo, StickyNote, ColorOption } from "@/types/todo";
import { UnifiedBoard } from "../board/UnifiedBoard";

interface TodoSectionProps {
  todos: Todo[];
  notes: StickyNote[];
  newTodo: string;
  newNote: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay?: boolean;
  selectedColor?: string;
  colors?: ColorOption[];
  onTodoChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onColorChange: (color: string) => void;
  onAddTodo: () => void;
  onAddNote: () => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export function TodoSection({
  todos,
  notes,
  newTodo,
  newNote,
  selectedDate,
  selectedTime,
  allDay,
  selectedColor = "yellow",
  colors = [],
  onTodoChange,
  onNoteChange,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onColorChange,
  onAddTodo,
  onAddNote,
  onToggleTodo,
  onDeleteTodo,
  onDeleteNote,
}: TodoSectionProps) {
  return (
    <div className="h-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-12rem)]">
      <UnifiedBoard
        todos={todos}
        notes={notes}
        newTodo={newTodo}
        newNote={newNote}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        allDay={allDay}
        selectedColor={selectedColor}
        colors={colors}
        onTodoChange={onTodoChange}
        onNoteChange={onNoteChange}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        onAllDayChange={onAllDayChange}
        onColorChange={onColorChange}
        onAddTodo={onAddTodo}
        onAddNote={onAddNote}
        onToggleTodo={onToggleTodo}
        onDeleteTodo={onDeleteTodo}
        onDeleteNote={onDeleteNote}
      />
    </div>
  );
}