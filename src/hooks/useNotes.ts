
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StickyNote } from "@/types/todo";

export function useNotes() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedNotes: StickyNote[] = data.map(note => ({
        id: note.id,
        text: note.text,
        color: note.color || 'yellow',
        user_id: note.user_id,
        category: note.category,
        priority: note.priority,
        title: note.title,
        pinned: note.pinned,
        created_at: note.created_at,
        updated_at: note.updated_at,
        metadata: typeof note.metadata === 'string' 
          ? JSON.parse(note.metadata) 
          : note.metadata || { width: 280, height: 280 },
        position: typeof note.position === 'string'
          ? JSON.parse(note.position)
          : note.position || { x: 0, y: 0 }
      }));

      setNotes(formattedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error("Erreur lors du chargement des notes");
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) {
      toast.error("La note ne peut pas être vide");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const metadata = { width: 280, height: 280 };
      const position = { x: 0, y: 0 };

      const newNoteData = {
        text: newNote,
        color: selectedColor,
        user_id: user.id,
        metadata: JSON.stringify(metadata),
        position: JSON.stringify(position)
      };

      const { data, error } = await supabase
        .from('notes')
        .insert(newNoteData)
        .select()
        .single();

      if (error) throw error;

      const formattedNote: StickyNote = {
        id: data.id,
        text: data.text,
        color: data.color,
        user_id: data.user_id,
        category: data.category,
        priority: data.priority,
        title: data.title,
        pinned: data.pinned,
        created_at: data.created_at,
        updated_at: data.updated_at,
        metadata: { width: 280, height: 280 },
        position: { x: 0, y: 0 }
      };

      setNotes(prev => [formattedNote, ...prev]);
      setNewNote("");
      toast.success("Note ajoutée avec succès");
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error("Erreur lors de l'ajout de la note");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes(prev => prev.filter(note => note.id !== id));
      toast.success("Note supprimée avec succès");
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error("Erreur lors de la suppression de la note");
    }
  };

  const updateNote = async (updatedNote: StickyNote) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          text: updatedNote.text,
          color: updatedNote.color,
          metadata: JSON.stringify(updatedNote.metadata),
          position: JSON.stringify(updatedNote.position)
        })
        .eq('id', updatedNote.id);

      if (error) throw error;

      setNotes(prev => prev.map(note =>
        note.id === updatedNote.id ? updatedNote : note
      ));
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error("Erreur lors de la mise à jour de la note");
    }
  };

  return {
    notes,
    newNote,
    selectedColor,
    isLoading,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote,
    updateNote
  };
}
