
import { useState, useMemo } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Todo, StickyNote as StickyNoteType, ColorOption } from "@/types/todo";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { TabsList } from "./tabs/TabsList";
import { BoardTabsContent } from "./tabs/TabsContent";
import { ToolbarContainer } from "./toolbar/ToolbarContainer";
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
  const [activeTab, setActiveTab] = useState<"todos" | "notes" | "calculator" | "translator" | "converter" | "chess">("todos");
  const isMobile = useIsMobile();

  const handleAddTodo = useMemo(() => {
    return () => {
      if (!newTodo.trim()) {
        toast.error("La tâche ne peut pas être vide");
        return;
      }
      onAddTodo();
    };
  }, [newTodo, onAddTodo]);

  const handleAddNote = useMemo(() => {
    return () => {
      if (!newNote.trim()) {
        toast.error("La note ne peut pas être vide");
        return;
      }
      onAddNote();
    };
  }, [newNote, onAddNote]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-lg"
    >
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as typeof activeTab)}
        className="h-full flex flex-col"
      >
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-t-lg border-b">
          <TabsList />
          
          <ToolbarContainer 
            activeTab={activeTab}
            newTodo={newTodo}
            newNote={newNote}
            selectedColor={selectedColor}
            colors={colors}
            onTodoChange={onTodoChange}
            onNoteChange={onNoteChange}
            onColorChange={onColorChange}
            onAddTodo={handleAddTodo}
            onAddNote={handleAddNote}
          />
        </div>

        <BoardTabsContent
          todos={todos}
          notes={notes}
          onToggleTodo={onToggleTodo}
          onDeleteTodo={onDeleteTodo}
          onDeleteNote={onDeleteNote}
        />
      </Tabs>
    </motion.div>
  );
}
