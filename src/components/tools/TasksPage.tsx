import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ListTodo, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
}

export function TasksPage() {
  const [newTask, setNewTask] = useState("");

  const { data: tasks, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Task[];
    }
  });

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const { error } = await supabase
        .from('todos')
        .insert([{ text: newTask }]);

      if (error) throw error;

      toast.success("Tâche ajoutée");
      setNewTask("");
      refetch();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Erreur lors de l'ajout de la tâche");
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed })
        .eq('id', taskId);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error("Erreur lors de la mise à jour de la tâche");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast.success("Tâche supprimée");
      refetch();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Erreur lors de la suppression de la tâche");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <ListTodo className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Gestionnaire de tâches</h1>
      </div>

      <Card className="p-4 mb-6">
        <form onSubmit={addTask} className="flex gap-2">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Ajouter une nouvelle tâche..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </Card>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="space-y-2">
          {tasks?.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id, task.completed)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                    {task.text}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}