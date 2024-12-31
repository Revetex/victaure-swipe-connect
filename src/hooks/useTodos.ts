import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Todo } from "@/types/todo";
import { toast } from "sonner";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [allDay, setAllDay] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTodos = (data || []).map(todo => ({
        id: todo.id,
        text: todo.text,
        completed: todo.completed || false,
        dueDate: todo.due_date ? new Date(todo.due_date) : undefined,
        dueTime: todo.due_time,
        allDay: todo.all_day
      }));

      setTodos(formattedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error("Erreur lors du chargement des tâches");
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('todos')
        .insert({
          user_id: user.id,
          text: newTodo.trim(),
          completed: false,
          due_date: selectedDate?.toISOString().split('T')[0],
          due_time: allDay ? null : selectedTime,
          all_day: allDay
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newTodoItem: Todo = {
          id: data.id,
          text: data.text,
          completed: false,
          dueDate: data.due_date ? new Date(data.due_date) : undefined,
          dueTime: data.due_time,
          allDay: data.all_day
        };

        setTodos([newTodoItem, ...todos]);
        setNewTodo("");
        setSelectedDate(undefined);
        setSelectedTime(undefined);
        setAllDay(false);
        toast.success("Tâche ajoutée avec succès");
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error("Erreur lors de l'ajout de la tâche");
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.map(t => 
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast.error("Erreur lors de la mise à jour de la tâche");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.filter(t => t.id !== id));
      toast.success("Tâche supprimée avec succès");
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error("Erreur lors de la suppression de la tâche");
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
    handleAddTodo,
    handleToggleTodo,
    handleDeleteTodo
  };
}