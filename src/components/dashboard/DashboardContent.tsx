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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ListTodo, StickyNote } from "lucide-react";

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
      case 4: // Feed
        return <Feed />;
      case 5: // Tools
        return (
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Outils</h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="tasks" className="border rounded-lg bg-card">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-5 w-5" />
                      <span className="font-semibold">Tâches</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="h-[calc(100vh-16rem)]">
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="notes" className="border rounded-lg bg-card">
                  <AccordionTrigger className="px-4 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <StickyNote className="h-5 w-5" />
                      <span className="font-semibold">Notes</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <div className="h-[calc(100vh-16rem)]">
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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