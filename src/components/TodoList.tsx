import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Todo, StickyNote as StickyNoteType } from "@/types/todo";
import { TodoSection } from "./todo/TodoSection";
import { NotesSection } from "./todo/NotesSection";
import { supabase } from "@/integrations/supabase/client";

const colors = [
  { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
  { value: "green", label: "Vert", class: "bg-green-200" },
  { value: "blue", label: "Bleu", class: "bg-blue-200" },
  { value: "pink", label: "Rose", class: "bg-pink-200" },
];

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [notes, setNotes] = useState<StickyNoteType[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const { toast } = useToast();

  const addTodo = async () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        dueDate: selectedDate,
        dueTime: selectedTime,
      };
      setTodos([...todos, todo]);
      setNewTodo("");
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      
      toast({
        title: "Tâche ajoutée",
        description: "Votre nouvelle tâche a été ajoutée avec succès.",
      });

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
          .from('notifications')
          .insert([{
            user_id: user.id,
            title: "Nouvelle tâche",
            message: newTodo,
            read: false
          }]);
      } catch (error) {
        console.error('Error adding notification:', error);
      }
    }
  };

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

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    }));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Tâche supprimée",
      description: "La tâche a été supprimée avec succès.",
    });
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Note supprimée",
      description: "La note a été supprimée avec succès.",
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="todos">Tâches</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <TodoSection
            todos={todos}
            newTodo={newTodo}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onTodoChange={setNewTodo}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </TabsContent>

        <TabsContent value="notes">
          <NotesSection
            notes={notes}
            newNote={newNote}
            selectedColor={selectedColor}
            colors={colors}
            onNoteChange={setNewNote}
            onColorChange={setSelectedColor}
            onAdd={addNote}
            onDelete={deleteNote}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}