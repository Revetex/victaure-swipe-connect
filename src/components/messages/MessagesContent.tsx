import { TabsContent } from "@/components/ui/tabs";
import { TodoSection } from "@/components/todo/TodoSection";
import { NotesSection } from "@/components/todo/NotesSection";
import { AssistantTab } from "./tabs/AssistantTab";
import { ScrapedJobsList } from "./ScrapedJobsList";
import { ScrapedJob } from "@/types/database/scrapedJobs";

interface MessagesContentProps {
  todos: any[];
  notes: any[];
  newTodo: string;
  newNote: string;
  selectedDate: Date | undefined;
  selectedTime: string;
  selectedColor: string;
  allDay: boolean;
  onTodoChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  onColorChange: (color: string) => void;
  onAllDayChange: (allDay: boolean) => void;
  onAddTodo: () => void;
  onAddNote: () => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onDeleteNote: (id: string) => void;
  colors: { value: string; label: string; class: string; }[];
  scrapedJobs?: ScrapedJob[];
  isLoadingJobs?: boolean;
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
  scrapedJobs = [],
  isLoadingJobs = false,
}: MessagesContentProps) {
  return (
    <div className="flex-1 overflow-hidden">
      <TabsContent value="messages" className="h-full">
        <AssistantTab />
      </TabsContent>
      
      <TabsContent value="todos" className="h-full">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <TodoSection
            todos={todos}
            newTodo={newTodo}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            allDay={allDay}
            onTodoChange={onTodoChange}
            onDateChange={onDateChange}
            onTimeChange={onTimeChange}
            onAllDayChange={onAllDayChange}
            onAddTodo={onAddTodo}
            onToggleTodo={onToggleTodo}
            onDeleteTodo={onDeleteTodo}
          />
          <NotesSection
            notes={notes}
            newNote={newNote}
            selectedColor={selectedColor}
            onNoteChange={onNoteChange}
            onColorChange={onColorChange}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
            colors={colors}
          />
        </div>
      </TabsContent>

      <TabsContent value="jobs" className="h-full">
        <ScrapedJobsList jobs={scrapedJobs || []} isLoading={isLoadingJobs} />
      </TabsContent>
    </div>
  );
}