
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StickyNote } from "@/types/todo";

export function useNotes() {
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const [isLoading, setIsLoading] = useState(true);
  const [layout, setLayout] = useState<'grid' | 'masonry' | 'list'>('grid');

  useEffect(() => {
    fetchNotes();

    const channel = supabase
      .channel('notes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notes' },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
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

      setNotes(data.map(note => ({
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
        layout_type: note.layout_type || layout,
        metadata: {
          width: note.metadata?.width || 280,
          height: note.metadata?.height || 280,
          ...note.metadata
        },
        position: note.position || { x: 0, y: 0 }
      })));
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

      const { data, error } = await supabase
        .from('notes')
        .insert({
          text: newNote,
          color: selectedColor,
          user_id: user.id,
          layout_type: layout,
          metadata: {
            width: 280,
            height: 280
          },
          position: { x: 0, y: 0 }
        })
        .select()
        .single();

      if (error) throw error;

      setNotes(prev => [{
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
        layout_type: data.layout_type || layout,
        metadata: {
          width: data.metadata?.width || 280,
          height: data.metadata?.height || 280,
          ...data.metadata
        },
        position: data.position || { x: 0, y: 0 }
      }, ...prev]);

      setNewNote("");
      toast.success("Note ajoutée avec succès");
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error("Erreur lors de l'ajout de la note");
    }
  };

  const updateNote = async (note: StickyNote) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          text: note.text,
          color: note.color,
          metadata: note.metadata,
          position: note.position,
          updated_at: new Date().toISOString()
        })
        .eq('id', note.id);

      if (error) throw error;

      setNotes(prev => prev.map(n => 
        n.id === note.id ? { ...n, ...note } : n
      ));
      
      toast.success("Note mise à jour avec succès");
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error("Erreur lors de la mise à jour de la note");
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

  return {
    notes,
    newNote,
    selectedColor,
    layout,
    isLoading,
    setNewNote,
    setSelectedColor,
    setLayout,
    addNote,
    updateNote,
    deleteNote
  };
}
