
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Todo } from "@/types/todo";
import { supabase } from "@/integrations/supabase/client";

export function useTodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [allDay, setAllDay] = useState(false);
  const { toast } = useToast();

  const addTodo = async () => {
    if (newTodo.trim()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const todo: Todo = {
          id: Date.now().toString(),
          text: newTodo,
          completed: false,
          dueDate: selectedDate,
          dueTime: allDay ? undefined : selectedTime,
          allDay,
          user_id: user.id
        };

        setTodos([...todos, todo]);
        setNewTodo("");
        setSelectedDate(undefined);
        setSelectedTime(undefined);
        setAllDay(false);
        
        toast({
          title: "Tâche ajoutée",
          description: "Votre nouvelle tâche a été ajoutée avec succès.",
        });
      } catch (error) {
        console.error('Error adding todo:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la tâche.",
          variant: "destructive"
        });
      }
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    }));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Tâche supprimée",
      description: "La tâche a été supprimée avec succès.",
    });
  };

  return {
    todos,
    newTodo,
    selectedDate,
    selectedTime,
    allDay,
    setNewTodo,
    setSelectedDate,
    setSelectedTime,
    setAllDay,
    addTodo,
    toggleTodo,
    deleteTodo
  };
}
