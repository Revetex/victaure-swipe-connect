import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Plus, Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotes } from "@/hooks/useNotes";
import { StickyNote } from "@/components/todo/StickyNote";
import { ColorOption } from "@/types/todo";
import { toast } from "sonner";
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

  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleAddNote = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!newNote.trim()) {
      toast.error("Le contenu de la note ne peut pas être vide");
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    addNote();
    setPosition({ x, y });
  };

  return (
    <div className="h-full flex flex-col bg-background/95 backdrop-blur-sm rounded-lg border border-border/50">
      <div className="flex-none p-4 space-y-4 border-b border-border/50">
        <div className="flex gap-2">
          <Input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Nouvelle note..."
            className="flex-1"
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
          <Button onClick={() => setShowGrid(!showGrid)} size="icon" variant="ghost">
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={2}
          onTransformed={(ref) => setScale(ref.state.scale)}
        >
          <TransformComponent wrapperClass="w-full h-full" contentClass="w-full h-full">
            <div 
              className="relative w-full h-full min-h-[1000px]"
              onClick={handleAddNote}
            >
              <NotesGrid showGrid={showGrid} gridSize={GRID_SIZE} maxDistance={MAX_DISTANCE} />
              <motion.div layout className="absolute inset-0">
                <AnimatePresence mode="popLayout">
                  {notes?.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      style={{ 
                        position: 'absolute',
                        left: position.x,
                        top: position.y,
                        transform: `translate(-50%, -50%) scale(${1/scale})`
                      }}
                    >
                      <StickyNote
                        note={note}
                        colorClass={`sticky-note-${note.color}`}
                        onDelete={deleteNote}
                        draggable
                      />
                    </motion.div>
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