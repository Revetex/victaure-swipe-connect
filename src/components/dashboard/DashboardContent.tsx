import { memo, useMemo } from "react";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";
import { DashboardPageContent } from "./DashboardPageContent";

interface DashboardContentProps {
  currentPage: number;
  isEditing: boolean;
  viewportHeight: number;
  onEditStateChange: (state: boolean) => void;
  onRequestChat: () => void;
}

export const DashboardContent = memo(function DashboardContent({
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

  const todoProps = useMemo(() => ({
    todos,
    newTodo,
    selectedDate,
    selectedTime,
    allDay,
    onTodoChange: setNewTodo,
    onDateChange: setSelectedDate,
    onTimeChange: setSelectedTime,
    onAllDayChange: setAllDay,
    onAdd: addTodo,
    onToggle: toggleTodo,
    onDelete: deleteTodo
  }), [
    todos, newTodo, selectedDate, selectedTime, allDay,
    setNewTodo, setSelectedDate, setSelectedTime, setAllDay,
    addTodo, toggleTodo, deleteTodo
  ]);

  const noteProps = useMemo(() => ({
    notes,
    newNote,
    selectedColor,
    onNoteChange: setNewNote,
    onColorChange: setSelectedColor,
    onAdd: addNote,
    onDelete: deleteNote
  }), [
    notes, newNote, selectedColor,
    setNewNote, setSelectedColor, addNote, deleteNote
  ]);

  return (
    <DashboardPageContent
      currentPage={currentPage}
      isEditing={isEditing}
      viewportHeight={viewportHeight}
      onEditStateChange={onEditStateChange}
      onRequestChat={onRequestChat}
      todoProps={todoProps}
      noteProps={noteProps}
    />
  );
});