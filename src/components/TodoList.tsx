import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Todo } from "@/types/todo";
import { TodoSection } from "./todo/TodoSection";
import { supabase } from "@/integrations/supabase/client";

export function TodoList() {
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
        if (!user) return;

        const { data, error } = await supabase
          .from('todos')
          .insert({
            user_id: user.id,
            text: newTodo.trim(),
            completed: false,
            due_date: selectedDate?.toISOString().split('T')[0],
            due_time: allDay ? null : selectedTime,
            all_day: allDay,
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
          
          toast({
            title: "Tâche ajoutée",
            description: "Votre nouvelle tâche a été ajoutée avec succès.",
          });
        }
      } catch (error) {
        console.error('Error adding todo:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'ajout de la tâche.",
          variant: "destructive",
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

  return (
    <div className="space-y-4">
      <TodoSection
        todos={todos}
        newTodo={newTodo}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        allDay={allDay}
        onTodoChange={setNewTodo}
        onDateChange={setSelectedDate}
        onTimeChange={setSelectedTime}
        onAllDayChange={setAllDay}
        onAdd={addTodo}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}