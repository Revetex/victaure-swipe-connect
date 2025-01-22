import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { StickyNote } from "@/types/todo";
import { supabase } from "@/integrations/supabase/client";

export function useNotes() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const { toast } = useToast();

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notes",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setNotes(data.map(note => ({
        id: note.id,
        text: note.text,
        color: note.color,
      })));
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour ajouter une note",
        variant: "destructive",
      });
      return;
    }

    const note = {
      text: newNote,
      color: selectedColor,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('notes')
      .insert(note)
      .select()
      .single();

    if (error) {
      console.error('Error adding note:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la note",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      setNotes([{
        id: data.id,
        text: data.text,
        color: data.color,
      }, ...notes]);
      setNewNote("");
      
      toast({
        title: "Note ajoutée",
        description: "Votre note a été ajoutée avec succès",
      });
    }
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la note",
        variant: "destructive",
      });
      return;
    }

    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Note supprimée",
      description: "La note a été supprimée avec succès",
    });
  };

  return {
    notes,
    newNote,
    selectedColor,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote
  };
}