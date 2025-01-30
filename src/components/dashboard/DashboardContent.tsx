import { motion, AnimatePresence } from "framer-motion";
import { Messages } from "../Messages";
import { VCard } from "../VCard";
import { JobList } from "../jobs/JobList";
import { TodoSection } from "../todo/TodoSection";
import { Settings } from "../Settings";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";
import { ColorOption } from "@/types/todo";

interface DashboardContentProps {
  currentPage: number;
  isEditing: boolean;
  viewportHeight: number;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  isEditing,
  viewportHeight,
  onEditStateChange,
  onRequestChat,
}: DashboardContentProps) {
  const {
    todos,
    newTodo,
    selectedDate,
    selectedTime,
    allDay,
    setNewTodo,
    setSelectedDate,
    setSelectedTime,
    setAllDay,
    addTodo,
    toggleTodo,
    deleteTodo,
  } = useTodoList();

  const {
    notes,
    newNote,
    selectedColor,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote,
  } = useNotes();

  const colors: ColorOption[] = [
    { value: 'yellow', label: 'Jaune', class: 'bg-yellow-200' },
    { value: 'blue', label: 'Bleu', class: 'bg-blue-200' },
    { value: 'green', label: 'Vert', class: 'bg-green-200' },
    { value: 'red', label: 'Rouge', class: 'bg-red-200' },
    { value: 'purple', label: 'Violet', class: 'bg-purple-200' },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="p-4 sm:p-6 space-y-6">
            <VCard />
          </div>
        );
      case 2:
        return <Messages />;
      case 3:
        return (
          <div className="p-4 sm:p-6 space-y-6">
            <JobList jobs={[]} />
          </div>
        );
      case 4:
        return (
          <div className="p-4 sm:p-6">
            <TodoSection
              todos={todos}
              notes={notes}
              newTodo={newTodo}
              newNote={newNote}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              allDay={allDay}
              selectedColor={selectedColor}
              colors={colors}
              onTodoChange={setNewTodo}
              onNoteChange={setNewNote}
              onDateChange={setSelectedDate}
              onTimeChange={setSelectedTime}
              onAllDayChange={setAllDay}
              onColorChange={setSelectedColor}
              onAddTodo={addTodo}
              onAddNote={addNote}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onDeleteNote={deleteNote}
            />
          </div>
        );
      case 5:
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen pb-20"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}