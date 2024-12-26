import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ListTodo, Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: Date;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        dueDate: selectedDate,
      };
      setTodos([...todos, todo]);
      setNewTodo("");
      setSelectedDate(undefined);
      
      // Show notification
      toast({
        title: "Tâche ajoutée",
        description: "Votre nouvelle tâche a été ajoutée avec succès.",
      });

      // Add notification
      addNotification(`Nouvelle tâche: ${newTodo}`, selectedDate ? `À faire pour le ${format(selectedDate, 'dd/MM/yyyy')}` : "");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const completed = !todo.completed;
        if (completed) {
          toast({
            title: "Tâche terminée",
            description: "Bravo ! La tâche a été marquée comme terminée.",
          });
          addNotification("Tâche terminée", todo.text);
        }
        return { ...todo, completed };
      }
      return todo;
    }));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: "Tâche supprimée",
      description: "La tâche a été supprimée avec succès.",
      variant: "destructive",
    });
  };

  const addNotification = async (title: string, message: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: user.id,
            title,
            message,
            read: false
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <ListTodo className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Tâches</h2>
      </div>
      
      <div className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <Input
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Nouvelle tâche..."
            className="glass-card flex-1"
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className={`glass-card ${selectedDate ? 'text-primary' : ''}`}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button 
          onClick={addTodo} 
          size="icon"
          variant="outline"
          className="glass-card hover:bg-primary hover:text-white transition-colors"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-3 rounded-lg glass-card group animate-in slide-in-from-left duration-300"
          >
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
              className="data-[state=checked]:bg-primary"
            />
            <div className="flex-1">
              <span className={`block ${
                todo.completed 
                  ? "line-through text-muted-foreground" 
                  : "group-hover:text-primary transition-colors"
              }`}>
                {todo.text}
              </span>
              {todo.dueDate && (
                <span className="text-xs text-muted-foreground">
                  Pour le {format(todo.dueDate, 'dd/MM/yyyy', { locale: fr })}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}