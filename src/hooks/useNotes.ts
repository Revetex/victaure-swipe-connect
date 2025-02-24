
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StickyNote } from "@/types/todo";

interface DatabaseNote {
  id: string;
  text: string;
  color?: string;
  user_id: string;
  category?: string;
  priority?: string;
  title?: string;
  pinned?: boolean;
  created_at?: string;
  updated_at?: string;
  layout_type?: string;
  metadata?: {
    width?: number;
    height?: number;
  };
  position?: {
    x?: number;
    y?: number;
  };
}

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
      if (!data) return;

      const formattedNotes: StickyNote[] = data.map((note: DatabaseNote) => ({
        id: note.id,
        text: note.text,
        color: note.color || 'yellow',
        user_id: note.user_id,
        category: note.category || 'personal',
        priority: note.priority || 'normal',
        title: note.title || '',
        pinned: note.pinned || false,
        created_at: note.created_at || new Date().toISOString(),
        updated_at: note.updated_at || new Date().toISOString(),
        layout_type: (note.layout_type as 'grid' | 'masonry' | 'list') || layout,
        metadata: {
          width: note.metadata?.width || 280,
          height: note.metadata?.height || 280
        },
        position: {
          x: note.position?.x || 0,
          y: note.position?.y || 0
        }
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

      const newNoteData = {
        text: newNote,
        color: selectedColor,
        user_id: user.id,
        layout_type: layout,
        metadata: {
          width: 280,
          height: 280
        },
        position: { x: 0, y: 0 }
      };

      const { data, error } = await supabase
        .from('notes')
        .insert(newNoteData)
        .select()
        .single();

      if (error) throw error;
      if (!data) return;

      const formattedNote: StickyNote = {
        id: data.id,
        text: data.text,
        color: data.color,
        user_id: data.user_id,
        category: 'personal',
        priority: 'normal',
        title: '',
        pinned: false,
        created_at: data.created_at,
        updated_at: data.updated_at,
        layout_type: layout,
        metadata: {
          width: 280,
          height: 280
        },
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
