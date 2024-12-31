import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StickyNote, ColorOption } from "@/types/todo";

export function useNotes() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const { toast } = useToast();

  const colors: ColorOption[] = [
    { value: "yellow", label: "Jaune", class: "sticky-note-yellow" },
    { value: "blue", label: "Bleu", class: "sticky-note-blue" },
    { value: "green", label: "Vert", class: "sticky-note-green" },
    { value: "pink", label: "Rose", class: "sticky-note-pink" },
    { value: "purple", label: "Violet", class: "sticky-note-purple" },
    { value: "peach", label: "Pêche", class: "sticky-note-peach" },
    { value: "gray", label: "Gris", class: "sticky-note-gray" },
    { value: "orange", label: "Orange", class: "sticky-note-orange" }
  ];

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote,
        color: selectedColor,
      };
      setNotes([...notes, note]);
      setNewNote("");
      
      toast({
        title: "Note ajoutée",
        description: "Votre note a été ajoutée avec succès.",
      });
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Note supprimée",
      description: "La note a été supprimée avec succès.",
    });
  };

  return {
    notes,
    newNote,
    selectedColor,
    colors,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote
  };
}