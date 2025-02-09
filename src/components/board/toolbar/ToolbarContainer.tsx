
import { AnimatePresence } from "framer-motion";
import { TodoToolbar } from "../TodoToolbar";
import { NoteToolbar } from "../NoteToolbar";
import { motion } from "framer-motion";
import { ColorOption } from "@/types/todo";
import { ErrorBoundary } from "react-error-boundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ToolbarContainerProps {
  activeTab: string;
  newTodo: string;
  newNote: string;
  selectedColor: string;
  colors: ColorOption[];
  selectedDate?: Date;
  selectedTime?: string;
  allDay?: boolean;
  onTodoChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onColorChange: (color: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time: string) => void;
  onAllDayChange: (checked: boolean) => void;
  onAddTodo: () => void;
  onAddNote: () => void;
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

export function ToolbarContainer({
  activeTab,
  newTodo,
  newNote,
  selectedColor,
  colors,
  selectedDate,
  selectedTime,
  allDay,
  onTodoChange,
  onNoteChange,
  onColorChange,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onAddTodo,
  onAddNote
}: ToolbarContainerProps) {
  return (
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
            <TodoToolbar
              newTodo={newTodo}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              allDay={allDay}
              onTodoChange={onTodoChange}
              onDateChange={onDateChange}
              onTimeChange={onTimeChange}
              onAllDayChange={onAllDayChange}
              onAddTodo={onAddTodo}
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
            <NoteToolbar
              newNote={newNote}
              selectedColor={selectedColor}
              colors={colors}
              onNoteChange={onNoteChange}
              onColorChange={onColorChange}
              onAddNote={onAddNote}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ErrorBoundary>
  );
}
