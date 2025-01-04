import { Tabs } from "@/components/ui/tabs";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";
import { MessagesTabs } from "./messages/MessagesTabs";
import { MessagesContent } from "./messages/MessagesContent";
import { useEffect, useState } from "react";

export function Messages() {
  // Get the saved tab from localStorage or default to "messages"
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("messagesActiveTab") || "messages";
  });

  // Save the active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("messagesActiveTab", activeTab);
  }, [activeTab]);

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
    { value: 'peach', label: 'Pêche', class: 'bg-orange-200' },
    { value: 'gray', label: 'Gris', class: 'bg-gray-200' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-300' },
  ];

  return (
    <Tabs 
      defaultValue={activeTab} 
      className="h-full flex flex-col"
      onValueChange={setActiveTab}
    >
      <MessagesTabs />
      <MessagesContent
        todos={todos}
        notes={notes}
        newTodo={newTodo}
        newNote={newNote}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedColor={selectedColor}
        allDay={allDay}
        onTodoChange={setNewTodo}
        onNoteChange={setNewNote}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
        onColorChange={setSelectedColor}
        onAllDayChange={setAllDay}
        onAddTodo={addTodo}
        onAddNote={addNote}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
        onDeleteNote={deleteNote}
        colors={colors}
      />
    </Tabs>
  );
}