import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListTodo, StickyNote, Calculator, Languages, Ruler } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"todos" | "notes" | "calculator" | "translator" | "converter">("todos");

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
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        className="h-full flex flex-col"
      >
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="todos" className="flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Tâches</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculatrice</span>
            </TabsTrigger>
            <TabsTrigger value="translator" className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">Traducteur</span>
            </TabsTrigger>
            <TabsTrigger value="converter" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              <span className="hidden sm:inline">Convertisseur</span>
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "todos" ? (
            <TodoToolbar
              newTodo={newTodo}
              onTodoChange={onTodoChange}
              onAddTodo={handleAddTodo}
            />
          ) : activeTab === "notes" ? (
            <NoteToolbar
              newNote={newNote}
              selectedColor={selectedColor}
              colors={colors}
              onNoteChange={onNoteChange}
              onColorChange={onColorChange}
              onAddNote={handleAddNote}
            />
          ) : null}
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

          <TabsContent value="calculator" className="h-full m-0">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Calculatrice (Bientôt disponible)
            </div>
          </TabsContent>

          <TabsContent value="translator" className="h-full m-0">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Traducteur (Bientôt disponible)
            </div>
          </TabsContent>

          <TabsContent value="converter" className="h-full m-0">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Convertisseur (Bientôt disponible)
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}