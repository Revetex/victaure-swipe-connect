
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
  due_date?: string;
  due_time?: string;
  all_day?: boolean;
  created_at: string;
}

export const useTasks = () => {
  const { data: tasks, refetch } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Task[];
    }
  });

  const addTask = async (text: string, dueDate?: string) => {
    if (!text.trim()) return false;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour ajouter des tâches");
        return false;
      }

      const { error } = await supabase
        .from('todos')
        .insert([{ 
          text,
          user_id: user.id,
          due_date: dueDate,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast.success("Tâche ajoutée");
      refetch();
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Erreur lors de l'ajout de la tâche");
      return false;
    }
  };

  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks?.find(t => t.id === taskId);
      if (!task) return;

      const { error } = await supabase
        .from('todos')
        .update({ completed: !task.completed })
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

  return {
    tasks: tasks?.map(task => ({
      ...task,
      createdAt: task.created_at,
      dueDate: task.due_date
    })) || [],
    addTask,
    toggleTask,
    deleteTask
  };
};
