import { useState } from "react";
import { ListTodo, StickyNote as StickyNoteIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Todo, StickyNote as StickyNoteType } from "@/types/todo";
import { TodoInput } from "./todo/TodoInput";
import { TodoItem } from "./todo/TodoItem";
import { NotesInput } from "./todo/NotesInput";
import { StickyNote } from "./todo/StickyNote";

const colors = [
  { value: "yellow", label: "Jaune", class: "bg-yellow-200" },
  { value: "green", label: "Vert", class: "bg-green-200" },
  { value: "blue", label: "Bleu", class: "bg-blue-200" },
  { value: "pink", label: "Rose", class: "bg-pink-200" },
];

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [notes, setNotes] = useState<StickyNoteType[]>([]);
  const [newNote, setNewNote] = useState("");
  const [selectedColor, setSelectedColor] = useState("yellow");
  const { toast } = useToast();

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
            <StickyNoteIcon className="h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <TodoInput
            newTodo={newTodo}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onTodoChange={setNewTodo}
            onDateChange={setSelectedDate}
            onTimeChange={setSelectedTime}
            onAdd={addTodo}
          />

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <NotesInput
            newNote={newNote}
            selectedColor={selectedColor}
            colors={colors}
            onNoteChange={setNewNote}
            onColorChange={setSelectedColor}
            onAdd={addNote}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2">
            {notes.map((note) => {
              const colorClass = colors.find(c => c.value === note.color)?.class || "bg-yellow-200";
              return (
                <StickyNote
                  key={note.id}
                  note={note}
                  colorClass={colorClass}
                  onDelete={deleteNote}
                />
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}