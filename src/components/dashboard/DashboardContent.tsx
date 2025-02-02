import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { useProfile } from "@/hooks/useProfile";
import { useVCardStyle } from "@/components/vcard/VCardStyleContext";
import { Messages } from "@/components/Messages";
import { Marketplace } from "@/components/Marketplace";
import { Settings } from "@/components/Settings";
import { UnifiedBoard } from "@/components/board/UnifiedBoard";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";
import { Feed } from "@/components/Feed";
import { TodoSection } from "@/components/todo/TodoSection";
import { NotesSection } from "@/components/todo/NotesSection";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  isEditing?: boolean;
  onEditStateChange: (isEditing: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  viewportHeight,
  isEditing,
  onEditStateChange,
  onRequestChat
}: DashboardContentProps) {
  const { profile, setProfile } = useProfile();
  const { selectedStyle } = useVCardStyle();
  
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
    deleteTodo
  } = useTodoList();

  const {
    notes,
    newNote,
    selectedColor,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote
  } = useNotes();

  const colors = [
    { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
    { value: "blue", label: "Bleu", class: "bg-blue-200" },
    { value: "green", label: "Vert", class: "bg-green-200" },
    { value: "red", label: "Rouge", class: "bg-red-200" },
    { value: "purple", label: "Violet", class: "bg-purple-200" }
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 1: // Profile
        return (
          <div className="max-w-7xl mx-auto">
            <VCard 
              onEditStateChange={onEditStateChange}
              onRequestChat={onRequestChat}
            />
          </div>
        );
      case 2: // Messages
        return <Messages />;
      case 3: // Jobs
        return <Marketplace />;
      case 4: // Feed (previously Notes/Tasks)
        return <Feed />;
      case 5: // Tools
        return (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Outils</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-[calc(100vh-16rem)]">
                <h3 className="text-xl font-semibold mb-4">Tâches</h3>
                <TodoSection
                  todos={todos}
                  newTodo={newTodo}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  allDay={allDay}
                  onTodoChange={setNewTodo}
                  onDateChange={setSelectedDate}
                  onTimeChange={setSelectedTime}
                  onAllDayChange={setAllDay}
                  onAddTodo={addTodo}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={deleteTodo}
                />
              </div>
              <div className="h-[calc(100vh-16rem)]">
                <h3 className="text-xl font-semibold mb-4">Notes</h3>
                <NotesSection
                  notes={notes}
                  newNote={newNote}
                  selectedColor={selectedColor}
                  colors={colors}
                  onNoteChange={setNewNote}
                  onColorChange={setSelectedColor}
                  onAdd={addNote}
                  onDelete={deleteNote}
                />
              </div>
            </div>
          </div>
        );
      case 6: // Settings
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      {renderContent()}
    </motion.div>
  );
}