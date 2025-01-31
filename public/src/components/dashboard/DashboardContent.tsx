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
import { Tools } from "@/components/Tools";

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
      case 1:
        return (
          <div className="max-w-7xl mx-auto">
            <VCard 
              onEditStateChange={onEditStateChange}
              onRequestChat={onRequestChat}
            />
          </div>
        );
      case 2:
        return <Messages />;
      case 3:
        return <Marketplace />;
      case 4:
        return (
          <UnifiedBoard
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
        );
      case 5:
        return <Tools />;
      case 6:
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