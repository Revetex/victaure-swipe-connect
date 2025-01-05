import { useState } from "react";
import { TodoSection } from "../todo/TodoSection";
import { NotesSection } from "../todo/NotesSection";
import { DashboardStats } from "./DashboardStats";
import { DashboardChart } from "./DashboardChart";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { MrVictaureWelcome } from "./MrVictaureWelcome";
import { ScrapedJobs } from "./ScrapedJobs";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useNotes } from "@/hooks/useNotes";
import { useTodoList } from "@/hooks/useTodoList";

interface DashboardContentProps {
  currentPage: number;
  isEditing: boolean;
  viewportHeight: number;
  onEditStateChange: (value: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({ 
  currentPage,
  isEditing,
  viewportHeight,
  onEditStateChange,
  onRequestChat
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

  const colors = [
    { value: "red", label: "Rouge", class: "bg-red-500" },
    { value: "blue", label: "Bleu", class: "bg-blue-500" },
    { value: "green", label: "Vert", class: "bg-green-500" },
    { value: "yellow", label: "Jaune", class: "bg-yellow-500" }
  ];

  const handleDismissWelcome = () => {
    onEditStateChange(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-transparent">
      <div className="lg:col-span-8 space-y-4">
        <MrVictaureWelcome 
          onDismiss={handleDismissWelcome}
          onStartChat={onRequestChat}
        />
        <DashboardStats />
        <DashboardChart />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="lg:col-span-4 space-y-4">
        <QuickActions stats={stats} />
        <ScrapedJobs />
        <RecentActivity />
      </div>
    </div>
  );
}