import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Todo, StickyNote as StickyNoteType } from "@/types/todo";
import { TodoSection } from "./todo/TodoSection";
import { NotesSection } from "./todo/NotesSection";
import { CalendarView } from "./todo/CalendarView";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const colors = [
  { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
  { value: "green", label: "Vert", class: "bg-green-200" },
  { value: "blue", label: "Bleu", class: "bg-blue-200" },
  { value: "pink", label: "Rose", class: "bg-pink-200" },
];

export function TodoList() {
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [isAllDay, setIsAllDay] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch todos
  const { data: todos = [] } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(todo => ({
        ...todo,
        id: todo.id.toString(),
        dueDate: todo.due_date ? new Date(todo.due_date) : undefined,
        dueTime: todo.due_time,
        allDay: todo.all_day,
      }));
    }
  });

  // Fetch notes
  const { data: notes = [] } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(note => ({
        ...note,
        id: note.id.toString()
      }));
    }
  });

  // Add todo mutation
  const addTodoMutation = useMutation({
    mutationFn: async (todo: Omit<Todo, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('todos')
        .insert([{
          user_id: user.id,
          text: todo.text,
          completed: todo.completed,
          due_date: todo.dueDate?.toISOString().split('T')[0],
          due_time: todo.dueTime,
          all_day: todo.allDay,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Tâche ajoutée",
        description: "Votre nouvelle tâche a été ajoutée avec succès.",
      });
    },
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (note: Omit<StickyNoteType, 'id'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('notes')
        .insert([{
          user_id: user.id,
          text: note.text,
          color: note.color,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: "Note ajoutée",
        description: "Votre note a été ajoutée avec succès.",
      });
    },
  });

  // Toggle todo mutation
  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string, completed: boolean }) => {
      const { error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  // Delete todo mutation
  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée avec succès.",
      });
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast({
        title: "Note supprimée",
        description: "La note a été supprimée avec succès.",
      });
    },
  });

  const addTodo = async () => {
    if (newTodo.trim()) {
      await addTodoMutation.mutateAsync({
        text: newTodo,
        completed: false,
        dueDate: selectedDate,
        dueTime: isAllDay ? undefined : selectedTime,
        allDay: isAllDay,
      });
      
      setNewTodo("");
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setIsAllDay(false);
    }
  };

  const addNote = async () => {
    if (newNote.trim()) {
      await addNoteMutation.mutateAsync({
        text: newNote,
        color: selectedColor,
      });
      
      setNewNote("");
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await toggleTodoMutation.mutateAsync({
        id,
        completed: !todo.completed,
      });
    }
  };

  const deleteTodo = async (id: string) => {
    await deleteTodoMutation.mutateAsync(id);
  };

  const deleteNote = async (id: string) => {
    await deleteNoteMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos">Tâches</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <TodoSection
            todos={todos}
            newTodo={newTodo}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            isAllDay={isAllDay}
            onTodoChange={setNewTodo}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onAllDayChange={setIsAllDay}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarView todos={todos} onDateSelect={setSelectedDate} />
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
