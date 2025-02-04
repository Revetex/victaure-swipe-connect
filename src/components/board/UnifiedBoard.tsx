import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListTodo, StickyNote } from "lucide-react";
import { Todo, StickyNote as StickyNoteType, ColorOption } from "@/types/todo";
import { TodoToolbar } from "./TodoToolbar";
import { NoteToolbar } from "./NoteToolbar";
import { TodoList } from "./TodoList";
import { NoteGrid } from "./NoteGrid";

interface UnifiedBoardProps {
  todos: Todo[];
  notes: StickyNoteType[];
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

export function UnifiedBoard({
  todos = [],
  notes = [],
  newTodo = "",
  newNote = "",
  selectedColor = "yellow",
  colors = [],
  onTodoChange,
  onNoteChange,
  onColorChange,
  onAddTodo,
  onAddNote,
  onToggleTodo,
  onDeleteTodo,
  onDeleteNote,
}: UnifiedBoardProps) {
  const [activeTab, setActiveTab] = useState<"todos" | "notes">("todos");

  return (
    <div className="h-full bg-background/95 backdrop-blur-sm rounded-lg border border-border/50">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "todos" | "notes")}
        className="h-full flex flex-col"
      >
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="todos" className="flex items-center gap-2 text-base">
              <ListTodo className="h-4 w-4" />
              <span>Tâches</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2 text-base">
              <StickyNote className="h-4 w-4" />
              <span>Notes</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="p-3">
            {activeTab === "todos" ? (
              <TodoToolbar
                newTodo={newTodo}
                onTodoChange={onTodoChange}
                onAddTodo={onAddTodo}
              />
            ) : (
              <NoteToolbar
                newNote={newNote}
                selectedColor={selectedColor}
                colors={colors}
                onNoteChange={onNoteChange}
                onColorChange={onColorChange}
                onAddNote={onAddNote}
              />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="todos" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <TodoList
                  todos={todos}
                  onToggleTodo={onToggleTodo}
                  onDeleteTodo={onDeleteTodo}
                />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="notes" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-4">
                <NoteGrid
                  notes={notes}
                  onDeleteNote={onDeleteNote}
                />
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}