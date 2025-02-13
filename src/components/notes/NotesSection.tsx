
import { useNotes } from "@/hooks/useNotes";
import { NotesToolbar } from "./NotesToolbar";
import { NoteGrid } from "@/components/board/NoteGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StickyNote, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function NotesSection() {
  const isMobile = useIsMobile();
  const {
    notes,
    newNote,
    selectedColor,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote
  } = useNotes();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const colors = [
    { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
    { value: "blue", label: "Bleu", class: "bg-blue-200" },
    { value: "green", label: "Vert", class: "bg-green-200" },
    { value: "purple", label: "Violet", class: "bg-purple-200" },
    { value: "orange", label: "Orange", class: "bg-orange-200" }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-semibold text-foreground">Notes</h1>
          </div>
          <div className="flex items-center gap-2">
            <Select value={viewMode} onValueChange={(value: 'grid' | 'list') => setViewMode(value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Vue" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Mode d'affichage</SelectLabel>
                  <SelectItem value="grid">Grille</SelectItem>
                  <SelectItem value="list">Liste</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="p-4 shadow-sm border border-border/50">
          <NotesToolbar
            newNote={newNote}
            selectedColor={selectedColor}
            colors={colors}
            onNoteChange={setNewNote}
            onColorChange={setSelectedColor}
            onAdd={addNote}
          />
        </Card>
      </motion.div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="container mx-auto max-w-7xl p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <NoteGrid 
              notes={notes} 
              onDeleteNote={deleteNote} 
            />
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}
