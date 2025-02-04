import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Grid, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotes } from "@/hooks/useNotes";
import { StickyNote } from "@/components/todo/StickyNote";
import { ColorOption } from "@/types/todo";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const colors: ColorOption[] = [
  { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
  { value: "blue", label: "Bleu", class: "bg-blue-200" },
  { value: "green", label: "Vert", class: "bg-green-200" },
  { value: "red", label: "Rouge", class: "bg-red-200" },
  { value: "purple", label: "Violet", class: "bg-purple-200" }
];

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

  const navigate = useNavigate();
  const [showGrid, setShowGrid] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error("Le contenu de la note ne peut pas être vide");
      return;
    }
    addNote();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 animate-gradient" />
        {showGrid && (
          <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 opacity-20" />
        )}
      </div>

      {/* Header */}
      <div className="flex-none">
        <div className="p-4 border-b flex items-center justify-between bg-background/50 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGrid(!showGrid)}
            className={cn(showGrid ? "bg-accent" : "")}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 border-b bg-background/50 backdrop-blur-sm">
          <div className="flex gap-2 max-w-2xl mx-auto">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Nouvelle note..."
              className="flex-1 bg-background/50"
              onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
            />
            <Select 
              value={selectedColor} 
              onValueChange={setSelectedColor}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem 
                    key={color.value} 
                    value={color.value}
                    className={`sticky-note-${color.value} cursor-pointer`}
                  >
                    {color.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddNote} size="icon" variant="secondary">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="flex-1 overflow-auto p-4">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {notes?.map((note) => (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="h-fit"
              >
                <StickyNote
                  note={note}
                  colorClass={`sticky-note-${note.color}`}
                  onDelete={deleteNote}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}