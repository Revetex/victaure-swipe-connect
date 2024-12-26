import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ListTodo, Plus, Trash2, Calendar as CalendarIcon, Clock, StickyNote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate?: Date;
  dueTime?: string;
}

interface StickyNote {
  id: number;
  text: string;
  color: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const { toast } = useToast();
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");

  const colors = [
    { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
    { value: "green", label: "Vert", class: "bg-green-200" },
    { value: "blue", label: "Bleu", class: "bg-blue-200" },
    { value: "pink", label: "Rose", class: "bg-pink-200" },
  ];

  const timeOptions = Array.from({ length: 24 * 4 }, (_, i) => {
    const hour = Math.floor(i / 4);
    const minute = (i % 4) * 15;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const addTodo = async () => {
    if (newTodo.trim()) {
      const todo = {
        id: Date.now(),
        text: newTodo,
        completed: false,
        dueDate: selectedDate,
        dueTime: selectedTime,
      };
      setTodos([...todos, todo]);
      setNewTodo("");
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      
      toast({
        title: "Tâche ajoutée",
        description: "Votre nouvelle tâche a été ajoutée avec succès.",
      });

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
          .from('notifications')
          .insert([
            {
              user_id: user.id,
              title: "Nouvelle tâche",
              message: `${newTodo}${selectedDate ? ` - Pour le ${format(selectedDate, 'dd/MM/yyyy')}` : ''}${selectedTime ? ` à ${selectedTime}` : ''}`,
              read: false
            }
          ]);
      } catch (error) {
        console.error('Error adding notification:', error);
      }
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote,
        color: selectedColor,
      };
      setNotes([...notes, note]);
      setNewNote("");
      
      toast({
        title: "Note ajoutée",
        description: "Votre note a été ajoutée avec succès.",
      });
    }
  };

  const toggleTodo = async (id: number) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const completed = !todo.completed;
        if (completed) {
          toast({
            title: "Tâche terminée",
            description: "Bravo ! La tâche a été marquée comme terminée.",
          });
          
          const addCompletionNotification = async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return;

              await supabase
                .from('notifications')
                .insert([
                  {
                    user_id: user.id,
                    title: "Tâche terminée",
                    message: todo.text,
                    read: false
                  }
                ]);
            } catch (error) {
              console.error('Error adding completion notification:', error);
            }
          };
          addCompletionNotification();
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

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    toast({
      title: "Note supprimée",
      description: "La note a été supprimée avec succès.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="todos" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            Tâches
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
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
              <Select onValueChange={setSelectedTime} value={selectedTime}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Heure">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {selectedTime || "Heure"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  {(todo.dueDate || todo.dueTime) && (
                    <span className="text-xs text-muted-foreground">
                      {todo.dueDate && `Pour le ${format(todo.dueDate, 'dd/MM/yyyy', { locale: fr })}`}
                      {todo.dueTime && ` à ${todo.dueTime}`}
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
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Nouvelle note..."
              className="glass-card flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addNote()}
            />
            <Select onValueChange={setSelectedColor} defaultValue={selectedColor}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem 
                    key={color.value} 
                    value={color.value}
                    className={`${color.class} rounded-md`}
                  >
                    {color.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={addNote}
              size="icon"
              variant="outline"
              className="glass-card hover:bg-primary hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {notes.map((note) => {
              const colorClass = colors.find(c => c.value === note.color)?.class || "bg-yellow-200";
              return (
                <div
                  key={note.id}
                  className={`p-4 rounded-lg shadow-sm group animate-in slide-in-from-left duration-300 ${colorClass}`}
                >
                  <div className="flex justify-between items-start">
                    <p className="flex-1 whitespace-pre-wrap">{note.text}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive -mt-2 -mr-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}