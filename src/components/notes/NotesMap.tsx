import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Plus, Minus, MoveIcon, Calculator, Languages, Ruler, ListTodo, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotes } from "@/hooks/useNotes";
import { StickyNote } from "@/components/todo/StickyNote";
import { ColorOption } from "@/types/todo";
import { toast } from "sonner";
import { TodoSection } from "@/components/todo/TodoSection";

const colors: ColorOption[] = [
  { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
  { value: "blue", label: "Bleu", class: "bg-blue-200" },
  { value: "green", label: "Vert", class: "bg-green-200" },
  { value: "red", label: "Rouge", class: "bg-red-200" },
  { value: "purple", label: "Violet", class: "bg-purple-200" }
];

const GRID_SIZE = 50; // Size of grid cells in pixels
const MAX_DISTANCE = 2000; // Maximum distance from center in pixels

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

  const renderGrid = () => {
    if (!showGrid) return null;

    const gridLines = [];
    const numLines = Math.ceil(MAX_DISTANCE / GRID_SIZE) * 2;
    
    // Vertical lines
    for (let i = 0; i < numLines; i++) {
      const position = (i - numLines/2) * GRID_SIZE;
      gridLines.push(
        <line
          key={`v${i}`}
          x1={position}
          y1={-MAX_DISTANCE}
          x2={position}
          y2={MAX_DISTANCE}
          stroke="#ddd"
          strokeWidth="1"
        />
      );
    }
    
    // Horizontal lines
    for (let i = 0; i < numLines; i++) {
      const position = (i - numLines/2) * GRID_SIZE;
      gridLines.push(
        <line
          key={`h${i}`}
          x1={-MAX_DISTANCE}
          y1={position}
          x2={MAX_DISTANCE}
          y2={position}
          stroke="#ddd"
          strokeWidth="1"
        />
      );
    }

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{ width: MAX_DISTANCE * 2, height: MAX_DISTANCE * 2, left: -MAX_DISTANCE, top: -MAX_DISTANCE }}
      >
        {gridLines}
      </svg>
    );
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
        return <TodoSection />;
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
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setShowGrid(!showGrid)}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Minus className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <MoveIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              variant={selectedTool === "notes" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTool("notes")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Notes
            </Button>
            <Button 
              variant={selectedTool === "tasks" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTool("tasks")}
            >
              <ListTodo className="h-4 w-4 mr-2" />
              Tâches
            </Button>
            <Button 
              variant={selectedTool === "calculator" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTool("calculator")}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculatrice
            </Button>
            <Button 
              variant={selectedTool === "translator" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTool("translator")}
            >
              <Languages className="h-4 w-4 mr-2" />
              Traducteur
            </Button>
            <Button 
              variant={selectedTool === "converter" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTool("converter")}
            >
              <Ruler className="h-4 w-4 mr-2" />
              Convertisseur
            </Button>
          </div>
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
              {renderGrid()}
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