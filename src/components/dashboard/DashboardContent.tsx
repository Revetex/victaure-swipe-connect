import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { VCard } from "@/components/VCard";
import { Settings } from "@/components/Settings";
import { TodoSection } from "@/components/todo/TodoSection";
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

  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div 
            key="vcard-container"
            className={`${isEditing ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm pb-32' : 'relative min-h-[calc(100vh-4rem)]'}`}
            style={{ 
              height: isEditing ? viewportHeight : 'auto',
              overflowY: isEditing ? 'auto' : 'visible',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="h-full">
              <div className="p-3 sm:p-4 md:p-6 h-full">
                <VCard 
                  onEditStateChange={onEditStateChange}
                  onRequestChat={onRequestChat}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div key="messages-container" className="h-full">
            <div className="p-3 sm:p-4 md:p-6 h-full">
              <Messages />
            </div>
          </div>
        );
      case 3:
        return (
          <div key="swipe-container" className="h-full">
            <SwipeJob />
          </div>
        );
      case 4:
        return (
          <div key="todo-notes-container" className="h-full">
            <div className="p-3 sm:p-4 md:p-6 h-full">
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
          </div>
        );
      case 5:
        return (
          <div key="settings-container" className="h-full">
            <div className="p-3 sm:p-4 md:p-6 h-full">
              <Settings />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return renderContent();
}