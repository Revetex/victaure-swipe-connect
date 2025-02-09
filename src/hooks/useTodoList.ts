
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
      const todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        dueDate: selectedDate,
        dueTime: allDay ? undefined : selectedTime,
        allDay,
      };

      try {
        const { data, error } = await supabase
          .from('todos')
          .insert({
            text: todo.text,
            due_date: todo.dueDate,
            due_time: todo.dueTime,
            all_day: todo.allDay
          })
          .select()
          .single();

        if (error) throw error;

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
          description: "Une erreur est survenue lors de l'ajout de la tâche.",
          variant: "destructive"
        });
      }
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      const { error } = await supabase
        .from('todos')
        .update({ completed: !todoToUpdate.completed })
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.map(todo => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      }));
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de la tâche.",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.filter(todo => todo.id !== id));
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée avec succès.",
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la tâche.",
        variant: "destructive"
      });
    }
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
