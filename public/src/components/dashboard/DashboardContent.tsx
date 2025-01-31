import { AnimatePresence, motion } from "framer-motion";
import { Messages } from "../Messages";
import { Tools } from "../Tools";
import { Settings } from "../Settings";
import { UnifiedBoard } from "../board/UnifiedBoard";
import { AIAssistant } from "./AIAssistant";
import { DashboardStats } from "./DashboardStats";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { ScrapedJobs } from "./ScrapedJobs";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";

interface DashboardContentProps {
  currentPage: number;
  viewportHeight: number;
  onEditStateChange: (editing: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  viewportHeight,
  onEditStateChange,
  onRequestChat,
}: DashboardContentProps) {
  const { data: stats } = useDashboardStats();
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

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        {currentPage === 1 && (
          <div className="space-y-8 pb-20">
            <DashboardStats />
            <QuickActions stats={stats} />
            <RecentActivity />
          </div>
        )}

        {currentPage === 2 && (
          <div className="pb-20">
            <Messages />
          </div>
        )}

        {currentPage === 3 && (
          <div className="pb-20">
            <UnifiedBoard
              todos={todos}
              notes={notes}
              newTodo={newTodo}
              newNote={newNote}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              allDay={allDay}
              selectedColor={selectedColor}
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
            <ScrapedJobs />
          </div>
        )}

        {currentPage === 4 && (
          <div className="pb-20">
            <AIAssistant onClose={() => onEditStateChange(false)} />
          </div>
        )}

        {currentPage === 5 && (
          <div className="pb-20">
            <Tools />
          </div>
        )}

        {currentPage === 6 && (
          <div className="pb-20">
            <Settings />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}