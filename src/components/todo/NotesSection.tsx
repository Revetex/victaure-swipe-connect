import { StickyNote as StickyNoteIcon } from "lucide-react";
import { NotesInput } from "./NotesInput";
import { StickyNote } from "./StickyNote";
import { ColorOption, StickyNote as StickyNoteType } from "@/types/todo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const colors: ColorOption[] = [
  { value: "yellow", label: "Jaune", class: "bg-[#FEF7CD]" },
  { value: "green", label: "Vert", class: "bg-[#F2FCE2]" },
  { value: "blue", label: "Bleu", class: "bg-[#D3E4FD]" },
  { value: "purple", label: "Violet", class: "bg-[#E5DEFF]" },
  { value: "pink", label: "Rose", class: "bg-[#FFDEE2]" },
  { value: "orange", label: "Orange", class: "bg-[#FDE1D3]" },
  { value: "gray", label: "Gris", class: "bg-[#F1F0FB]" },
];

export function NotesSection() {
  const [notes, setNotes] = useState<StickyNoteType[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0].value);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error("Erreur lors du chargement des notes");
    }
  };

  const handleAdd = async () => {
    if (!newNote.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notes')
        .insert([
          {
            user_id: user.id,
            text: newNote.trim(),
            color: selectedColor,
          }
        ]);

      if (error) throw error;

      setNewNote("");
      fetchNotes();
      toast.success("Note ajoutée");
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error("Erreur lors de l'ajout de la note");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotes(notes.filter(note => note.id !== id));
      toast.success("Note supprimée");
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error("Erreur lors de la suppression de la note");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <StickyNoteIcon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Notes</h2>
      </div>

      <NotesInput
        newNote={newNote}
        selectedColor={selectedColor}
        colors={colors}
        onNoteChange={setNewNote}
        onColorChange={setSelectedColor}
        onAdd={handleAdd}
      />

      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-4">
          {notes.map((note) => {
            const colorClass = colors.find(c => c.value === note.color)?.class || "bg-yellow-100";
            return (
              <StickyNote
                key={note.id}
                note={note}
                colorClass={colorClass}
                onDelete={handleDelete}
              />
            );
          })}
          {notes.length === 0 && (
            <div className="text-center text-muted-foreground py-8 col-span-2">
              Aucune note pour le moment
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}