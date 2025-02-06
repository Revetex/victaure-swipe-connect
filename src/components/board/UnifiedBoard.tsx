
import { useState, useMemo, memo } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calculator, Languages, Ruler, Sword } from "lucide-react";
import { TodoToolbar } from "./TodoToolbar";
import { NoteToolbar } from "./NoteToolbar";
import { TodoList } from "./TodoList";
import { NoteGrid } from "./NoteGrid";
import { toast } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { UnifiedBoardProps, ActiveTab } from "./types";
import { ErrorFallback } from "./error/ErrorFallback";
import { LoadingFallback } from "./loading/LoadingFallback";
import { BoardTabs } from "./tabs/BoardTabs";
import { FutureFeature } from "./content/FutureFeature";

const MemoizedTodoToolbar = memo(TodoToolbar);
const MemoizedNoteToolbar = memo(NoteToolbar);
const MemoizedTodoList = memo(TodoList);
const MemoizedNoteGrid = memo(NoteGrid);

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
  const [activeTab, setActiveTab] = useState<ActiveTab>("todos");
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

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="h-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as ActiveTab)}
        className="h-full flex flex-col"
      >
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <BoardTabs activeTab={activeTab} onTabChange={(value) => setActiveTab(value as ActiveTab)} />
          
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AnimatePresence mode="wait">
              {activeTab === "todos" ? (
                <motion.div
                  key="todos-toolbar"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tabVariants}
                >
                  <MemoizedTodoToolbar
                    newTodo={newTodo}
                    onTodoChange={onTodoChange}
                    onAddTodo={handleAddTodo}
                  />
                </motion.div>
              ) : activeTab === "notes" ? (
                <motion.div
                  key="notes-toolbar"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={tabVariants}
                >
                  <MemoizedNoteToolbar
                    newNote={newNote}
                    selectedColor={selectedColor}
                    colors={colors}
                    onNoteChange={onNoteChange}
                    onColorChange={onColorChange}
                    onAddNote={handleAddNote}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </ErrorBoundary>
        </div>

        <div className="flex-1 overflow-hidden">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AnimatePresence mode="wait">
              <TabsContent value="todos" className="h-full m-0">
                <ScrollArea className="h-full px-4">
                  <MemoizedTodoList
                    todos={todos}
                    onToggleTodo={onToggleTodo}
                    onDeleteTodo={onDeleteTodo}
                  />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="notes" className="h-full m-0">
                <ScrollArea className="h-full">
                  <MemoizedNoteGrid
                    notes={notes}
                    onDeleteNote={onDeleteNote}
                  />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="calculator" className="h-full m-0">
                <FutureFeature Icon={Calculator} title="Calculatrice" />
              </TabsContent>

              <TabsContent value="translator" className="h-full m-0">
                <FutureFeature Icon={Languages} title="Traducteur" />
              </TabsContent>

              <TabsContent value="converter" className="h-full m-0">
                <FutureFeature Icon={Ruler} title="Convertisseur" />
              </TabsContent>

              <TabsContent value="chess" className="h-full m-0">
                <FutureFeature Icon={Sword} title="Échecs" />
              </TabsContent>
            </AnimatePresence>
          </ErrorBoundary>
        </div>
      </Tabs>
    </div>
  );
}
