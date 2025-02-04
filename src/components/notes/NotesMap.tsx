import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotes } from "@/hooks/useNotes";
import { useTodoList } from "@/hooks/useTodoList";
import { StickyNote } from "@/components/todo/StickyNote";
import { ColorOption } from "@/types/todo";
import { toast } from "sonner";
import { TodoSection } from "@/components/todo/TodoSection";
import { NotesToolbar } from "./NotesToolbar";
import { NotesToolSelector } from "./NotesToolSelector";
import { NotesGrid } from "./NotesGrid";

const colors: ColorOption[] = [
  { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
  { value: "blue", label: "Bleu", class: "bg-blue-200" },
  { value: "green", label: "Vert", class: "bg-green-200" },
  { value: "red", label: "Rouge", class: "bg-red-200" },
  { value: "purple", label: "Violet", class: "bg-purple-200" }
];

const GRID_SIZE = 50;
const MAX_DISTANCE = 2000;

export function NotesMap() {
  const {
    notes,
    newNote,
    selectedColor,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote
  } = useNotes();

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

  const [scale, setScale] = useState(1);
  const [selectedTool, setSelectedTool] = useState<string>("notes");
  const [showGrid, setShowGrid] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote();
      toast.success("Note ajoutée avec succès");
    }
  };

  const renderTool = () => {
    switch (selectedTool) {
      case "notes":
        return (
          <div className="flex gap-2 mb-4">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Nouvelle note..."
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
            />
            <Select onValueChange={setSelectedColor} defaultValue={selectedColor}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem 
                    key={color.value} 
                    value={color.value}
                    className={`sticky-note-${color.value}`}
                  >
                    {color.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddNote} size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        );
      case "tasks":
        return (
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
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
          />
        );
      case "calculator":
        return <div className="p-4">Calculatrice (à implémenter)</div>;
      case "translator":
        return <div className="p-4">Traducteur (à implémenter)</div>;
      case "converter":
        return <div className="p-4">Convertisseur (à implémenter)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur-sm rounded-lg border border-border/50">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4">
        {renderTool()}

        <div className="flex justify-between items-center gap-2">
          <NotesToolbar showGrid={showGrid} onToggleGrid={() => setShowGrid(!showGrid)} />
          <NotesToolSelector selectedTool={selectedTool} onToolSelect={setSelectedTool} />
        </div>
      </div>

      <div className="flex-1 overflow-hidden" ref={containerRef}>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={2}
          onTransformed={(ref) => setScale(ref.state.scale)}
        >
          <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full">
            <div className="relative w-full h-full min-h-[1000px]">
              <NotesGrid showGrid={showGrid} gridSize={GRID_SIZE} maxDistance={MAX_DISTANCE} />
              <motion.div layout className="absolute inset-0">
                <AnimatePresence mode="popLayout">
                  {notes?.map((note) => (
                    <StickyNote
                      key={note.id}
                      note={note}
                      colorClass={`sticky-note-${note.color}`}
                      onDelete={deleteNote}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}