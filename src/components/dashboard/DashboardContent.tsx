import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { VCard } from "@/components/VCard";
import { Settings } from "@/components/Settings";
import { TodoSection } from "@/components/todo/TodoSection";
import { NotesSection } from "@/components/todo/NotesSection";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";

interface DashboardContentProps {
  currentPage: number;
  isEditing: boolean;
  viewportHeight: number;
  onEditStateChange: (state: boolean) => void;
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
    { value: 'yellow', label: 'Jaune', class: 'bg-yellow-200' },
    { value: 'blue', label: 'Bleu', class: 'bg-blue-200' },
    { value: 'green', label: 'Vert', class: 'bg-green-200' },
    { value: 'pink', label: 'Rose', class: 'bg-pink-200' },
    { value: 'purple', label: 'Violet', class: 'bg-purple-200' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-200' },
  ];

  if (currentPage === 1) {
    return (
      <div 
        className={`${isEditing ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm' : 'relative'}`}
        style={{ 
          height: isEditing ? viewportHeight : 'auto',
          overflowY: isEditing ? 'auto' : 'visible',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="dashboard-card h-full">
          <div className="p-3 sm:p-4 md:p-6 h-full">
            <VCard 
              onEditStateChange={onEditStateChange}
              onRequestChat={onRequestChat}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 2) {
    return (
      <div className="dashboard-card h-full">
        <div className="p-3 sm:p-4 md:p-6 h-full">
          <Messages />
        </div>
      </div>
    );
  }

  if (currentPage === 3) {
    return (
      <div className="dashboard-card h-full">
        <SwipeJob />
      </div>
    );
  }

  if (currentPage === 4) {
    return (
      <div className="dashboard-card h-full">
        <div className="p-3 sm:p-4 md:p-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
            <div className="h-full overflow-hidden">
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
                onAdd={addTodo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            </div>
            <div className="h-full overflow-hidden">
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
      </div>
    );
  }

  if (currentPage === 5) {
    return (
      <div className="dashboard-card h-full">
        <div className="p-3 sm:p-4 md:p-6 h-full">
          <Settings />
        </div>
      </div>
    );
  }

  return null;
}