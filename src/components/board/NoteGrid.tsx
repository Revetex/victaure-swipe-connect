
import { AnimatePresence } from "framer-motion";
import { StickyNote as StickyNoteType } from "@/types/todo";
import { EmptyNoteState } from "./note-grid/EmptyNoteState";
import { NoteGridContainer } from "./note-grid/NoteGridContainer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface NoteGridProps {
  notes: StickyNoteType[];
  onDeleteNote: (id: string) => void;
}

export function NoteGrid({ notes, onDeleteNote }: NoteGridProps) {
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'list'>('grid');

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex justify-end">
        <Select value={layout} onValueChange={(value: 'grid' | 'masonry' | 'list') => setLayout(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choisir l'affichage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grid">Grille</SelectItem>
            <SelectItem value="masonry">Mosaïque</SelectItem>
            <SelectItem value="list">Liste</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence mode="popLayout">
        {notes && notes.length > 0 ? (
          <NoteGridContainer 
            notes={notes} 
            onDeleteNote={onDeleteNote} 
            layout={layout}
          />
        ) : (
          <EmptyNoteState />
        )}
      </AnimatePresence>
    </div>
  );
}
