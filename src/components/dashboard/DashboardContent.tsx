import { useState } from "react";
import { TodoSection } from "../todo/TodoSection";
import { NotesSection } from "../todo/NotesSection";
import { DashboardStats } from "./DashboardStats";
import { DashboardChart } from "./DashboardChart";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { MrVictaureWelcome } from "./MrVictaureWelcome";
import { ScrapedJobs } from "./ScrapedJobs";

export function DashboardContent() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const colors = ["red", "blue", "green", "yellow"];

  const handleAddTodo = () => {
    if (newTodo) {
      setTodos([...todos, newTodo]);
      setNewTodo("");
    }
  };

  const handleToggleTodo = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  const handleAddNote = () => {
    if (newNote) {
      setNotes([...notes, { text: newNote, color: selectedColor }]);
      setNewNote("");
    }
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
      <div className="lg:col-span-8 space-y-4">
        <MrVictaureWelcome />
        <DashboardStats />
        <DashboardChart />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TodoSection
            todos={todos}
            newTodo={newTodo}
            onTodoChange={setNewTodo}
            onAdd={handleAddTodo}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
          <NotesSection
            notes={notes}
            newNote={newNote}
            selectedColor={selectedColor}
            colors={colors}
            onNoteChange={setNewNote}
            onColorChange={setSelectedColor}
            onAdd={handleAddNote}
            onDelete={handleDeleteNote}
          />
        </div>
      </div>
      <div className="lg:col-span-4 space-y-4">
        <QuickActions />
        <ScrapedJobs />
        <RecentActivity />
      </div>
    </div>
  );
}
