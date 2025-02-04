import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListTodo, StickyNote } from "lucide-react";
import { Todo, StickyNote as StickyNoteType, ColorOption } from "@/types/todo";
import { TodoToolbar } from "./TodoToolbar";
import { NoteToolbar } from "./NoteToolbar";
import { TodoList } from "./TodoList";
import { NoteGrid } from "./NoteGrid";
import { toast } from "sonner";

interface UnifiedBoardProps {
  todos: Todo[];
  notes: StickyNoteType[];
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

  const handleAddTodo = () => {
    if (!newTodo.trim()) {
      toast.error("La tâche ne peut pas être vide");
      return;
    }
    onAddTodo();
  };

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("La note ne peut pas être vide");
      return;
    }
    onAddNote();
  };

  return (
    <div className="h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "todos" | "notes")}
        className="h-full flex flex-col"
      >
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          
          {activeTab === "todos" ? (
            <TodoToolbar
              newTodo={newTodo}
              onTodoChange={onTodoChange}
              onAddTodo={handleAddTodo}
            />
          ) : (
            <NoteToolbar
              newNote={newNote}
              selectedColor={selectedColor}
              colors={colors}
              onNoteChange={onNoteChange}
              onColorChange={onColorChange}
              onAddNote={handleAddNote}
            />
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="todos" className="h-full m-0">
            <ScrollArea className="h-full">
              <TodoList
                todos={todos}
                onToggleTodo={onToggleTodo}
                onDeleteTodo={onDeleteTodo}
              />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="notes" className="h-full m-0">
            <ScrollArea className="h-full">
              <NoteGrid
                notes={notes}
                onDeleteNote={onDeleteNote}
              />
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}