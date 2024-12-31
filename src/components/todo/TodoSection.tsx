import { useState, useEffect } from "react";
import { TodoInput } from "./TodoInput";
import { TodoItem } from "./TodoItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListTodo } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Todo } from "@/types/todo";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { TimeSelector } from "./TimeSelector";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TodoSectionProps {
  todos: Todo[];
  newTodo: string;
  selectedDate?: Date;
  selectedTime?: string;
  allDay: boolean;
  onTodoChange: (value: string) => void;
  onDateChange: (date?: Date) => void;
  onTimeChange: (time?: string) => void;
  onAllDayChange: (value: boolean) => void;
  onAdd: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoSection({
  todos,
  newTodo,
  selectedDate,
  selectedTime,
  allDay,
  onTodoChange,
  onDateChange,
  onTimeChange,
  onAllDayChange,
  onAdd,
  onToggle,
  onDelete
}: TodoSectionProps) {
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

      const formattedTodos: Todo[] = (data || []).map(todo => ({
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

  const handleAdd = async () => {
    if (!newTodo.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('todos')
        .insert([{
          user_id: user.id,
          text: newTodo.trim(),
          completed: false,
          due_date: selectedDate?.toISOString().split('T')[0],
          due_time: allDay ? null : selectedTime,
          all_day: allDay
        }])
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

  const handleToggle = async (id: string) => {
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

  const handleDelete = async (id: string) => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <ListTodo className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Tâches</h2>
      </div>

      <div className="space-y-4">
        <TodoInput
          newTodo={newTodo}
          onTodoChange={onTodoChange}
          onAdd={onAdd}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP", { locale: fr })
                ) : (
                  <span>Choisir une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {!allDay && (
            <TimeSelector
              selectedTime={selectedTime}
              onTimeChange={onTimeChange}
            />
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allDay"
              checked={allDay}
              onCheckedChange={(checked) => {
                onAllDayChange(checked === true);
                if (checked) {
                  onTimeChange(undefined);
                }
              }}
            />
            <Label htmlFor="allDay">Toute la journée</Label>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-2 pr-4">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
            {todos.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Aucune tâche pour le moment
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
