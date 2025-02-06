
import { Todo, StickyNote, ColorOption } from "@/types/todo";

export interface UnifiedBoardProps {
  todos: Todo[];
  notes: StickyNote[];
  newTodo: string;
  newNote: string;
  selectedColor?: string;
  colors?: ColorOption[];
  onTodoChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onAddTodo: () => void;
  onAddNote: () => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

export type ActiveTab = "todos" | "notes" | "calculator" | "translator" | "converter" | "chess";
