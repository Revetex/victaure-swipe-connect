import { ListTodo } from "lucide-react";
import { TodoInput } from "./TodoInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Todo } from "@/types/todo";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export function TodoSection() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

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
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error("Erreur lors du chargement des tâches");
    }
  };

  const handleAdd = async () => {
    if (!newTodo.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('todos')
        .insert([
          {
            user_id: user.id,
            text: newTodo.trim(),
            completed: false
          }
        ]);

      if (error) throw error;

      setNewTodo("");
      fetchTodos();
      toast.success("Tâche ajoutée");
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error("Erreur lors de l'ajout de la tâche");
    }
  };

  const handleToggle = async (id: number) => {
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

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.filter(t => t.id !== id));
      toast.success("Tâche supprimée");
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error("Erreur lors de la suppression de la tâche");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <ListTodo className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Tâches</h2>
      </div>

      <TodoInput
        newTodo={newTodo}
        onTodoChange={setNewTodo}
        onAdd={handleAdd}
      />

      <ScrollArea className="h-[400px]">
        <div className="space-y-2 pr-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-background/80 backdrop-blur-sm border"
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => handleToggle(todo.id)}
              />
              <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                {todo.text}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-destructive hover:text-destructive/80 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
          {todos.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              Aucune tâche pour le moment
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}