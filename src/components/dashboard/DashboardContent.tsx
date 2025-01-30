import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";
import { JobList } from "@/components/jobs/JobList";
import { UnifiedBoard } from "@/components/board/UnifiedBoard";
import { ColorOption } from "@/types/todo";
import { VCard } from "@/components/VCard";
import { JobFiltersPanel } from "@/components/jobs/JobFiltersPanel";
import { defaultFilters } from "@/components/jobs/JobFilterUtils";
import { motion } from "framer-motion";

interface DashboardContentProps {
  currentPage: number;
}

export function DashboardContent({ currentPage }: DashboardContentProps) {
  const { profile } = useProfile();
  const [filters, setFilters] = useState(defaultFilters);

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

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6"
          >
            <VCard />
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-[300px,1fr] gap-6 p-4 sm:p-6"
          >
            <div className="lg:sticky lg:top-6 space-y-6">
              <JobFiltersPanel
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
            <JobList jobs={[]} />
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6 space-y-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <JobList jobs={[]} />
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 sm:p-6"
          >
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
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {renderContent()}
    </div>
  );
}