
import { useState, useMemo, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListTodo, StickyNote, Calculator, Languages, Ruler, Sword } from "lucide-react";
import { Todo, StickyNote as StickyNoteType, ColorOption } from "@/types/todo";
import { TodoToolbar } from "./TodoToolbar";
import { NoteToolbar } from "./NoteToolbar";
import { TodoList } from "./TodoList";
import { NoteGrid } from "./NoteGrid";
import { toast } from "sonner";
import { ErrorBoundary } from "react-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ReloadIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Alert variant="destructive" className="m-4">
      <AlertTitle>Une erreur est survenue</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="bg-destructive/10 text-destructive px-4 py-2 rounded-md hover:bg-destructive/20 transition-colors"
        >
          Réessayer
        </button>
      </AlertDescription>
    </Alert>
  );
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <ReloadIcon className="h-8 w-8 animate-spin text-muted-foreground" />
  </div>
);

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

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2
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
          <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 h-14 p-1">
            <TabsTrigger 
              value="todos" 
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
            >
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Tâches</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
            >
              <StickyNote className="h-4 w-4" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="calculator" 
              className="flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">Calculatrice</span>
            </TabsTrigger>
            <TabsTrigger 
              value="translator" 
              className="hidden sm:flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
            >
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">Traducteur</span>
            </TabsTrigger>
            <TabsTrigger 
              value="converter" 
              className="hidden sm:flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
            >
              <Ruler className="h-4 w-4" />
              <span className="hidden sm:inline">Convertisseur</span>
            </TabsTrigger>
            <TabsTrigger 
              value="chess" 
              className="hidden sm:flex items-center gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all"
            >
              <Sword className="h-4 w-4" />
              <span className="hidden sm:inline">Échecs</span>
            </TabsTrigger>
          </TabsList>
          
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AnimatePresence mode="wait">
              {activeTab === "todos" ? (
                <motion.div
                  key="todos-toolbar"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-4"
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
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-4"
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
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center justify-center h-full p-4"
                >
                  <div className="text-center space-y-4">
                    <Calculator className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Calculatrice (Bientôt disponible)</p>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="translator" className="h-full m-0">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center justify-center h-full p-4"
                >
                  <div className="text-center space-y-4">
                    <Languages className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Traducteur (Bientôt disponible)</p>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="converter" className="h-full m-0">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center justify-center h-full p-4"
                >
                  <div className="text-center space-y-4">
                    <Ruler className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Convertisseur (Bientôt disponible)</p>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="chess" className="h-full m-0">
                <motion.div
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex items-center justify-center h-full p-4"
                >
                  <div className="text-center space-y-4">
                    <Sword className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Échecs (Bientôt disponible)</p>
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </ErrorBoundary>
        </div>
      </Tabs>
    </motion.div>
  );
}
