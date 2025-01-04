import { TabsContent } from "@/components/ui/tabs";
import { MessagesTab } from "./tabs/MessagesTab";
import { NotificationsTab } from "./tabs/NotificationsTab";
import { TodoSection } from "../todo/TodoSection";
import { Settings } from "../Settings";
import { PaymentBox } from "../dashboard/PaymentBox";
import { NotesSection } from "../todo/NotesSection";

interface MessagesContentProps {
  todos: any[];
  notes: any[];
  newTodo: string;
  newNote: string;
  selectedDate: Date | null;
  selectedTime: string;
  selectedColor: string;
  allDay: boolean;
  onTodoChange: (todo: string) => void;
  onNoteChange: (note: string) => void;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (time: string) => void;
  onColorChange: (color: string) => void;
  onAllDayChange: (allDay: boolean) => void;
  onAddTodo: () => void;
  onAddNote: () => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteNote: (id: string) => void;
  colors: Array<{ value: string; label: string; class: string; }>;
}

export function MessagesContent({
  todos,
  notes,
  newTodo,
  newNote,
  selectedDate,
  selectedTime,
  selectedColor,
  allDay,
  onTodoChange,
  onNoteChange,
  onDateChange,
  onTimeChange,
  onColorChange,
  onAllDayChange,
  onAddTodo,
  onAddNote,
  onToggleTodo,
  onDeleteTodo,
  onDeleteNote,
  colors,
}: MessagesContentProps) {
  return (
    <div className="flex-1 overflow-hidden pt-14">
      <TabsContent value="messages" className="h-full mt-0">
        <MessagesTab />
      </TabsContent>
      <TabsContent value="notifications" className="h-full mt-0">
        <NotificationsTab />
      </TabsContent>
      <TabsContent value="notes" className="h-full mt-0">
        <NotesSection
          notes={notes}
          newNote={newNote}
          selectedColor={selectedColor}
          colors={colors}
          onNoteChange={onNoteChange}
          onColorChange={onColorChange}
          onAdd={onAddNote}
          onDelete={onDeleteNote}
        />
      </TabsContent>
      <TabsContent value="tasks" className="h-full mt-0">
        <TodoSection
          type="tasks"
          todos={todos}
          newTodo={newTodo}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          allDay={allDay}
          onTodoChange={onTodoChange}
          onDateChange={onDateChange}
          onTimeChange={onTimeChange}
          onAllDayChange={onAllDayChange}
          onAdd={onAddTodo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
        />
      </TabsContent>
      <TabsContent value="payments" className="h-full mt-0">
        <PaymentBox />
      </TabsContent>
      <TabsContent value="settings" className="h-full mt-0 overflow-y-auto">
        <Settings />
      </TabsContent>
    </div>
  );
}