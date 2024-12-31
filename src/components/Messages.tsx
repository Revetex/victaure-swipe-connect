import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMessages } from "@/hooks/useMessages";
import { MessagesTab } from "./messages/tabs/MessagesTab";
import { NotificationsTab } from "./messages/tabs/NotificationsTab";
import { Settings } from "./Settings";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Bell, Settings2, ListTodo, StickyNote } from "lucide-react";
import { TodoSection } from "./todo/TodoSection";
import { NotesSection } from "./todo/NotesSection";
import { Todo } from "@/types/todo";
import { toast } from "sonner";

interface Notification {
  id: string;
  read: boolean;
}

export function Messages() {
  const { messages: userMessages } = useMessages();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [allDay, setAllDay] = useState(false);
  const [activeTab, setActiveTab] = useState("messages");
  const unreadMessagesCount = userMessages.filter(m => !m.read).length;
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('id, read')
          .eq('user_id', user.id);

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const markNotificationsAsRead = async () => {
      if (activeTab === "notifications" && unreadNotificationsCount > 0) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id)
            .eq('read', false);

          if (error) throw error;

          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
          console.error('Error marking notifications as read:', error);
        }
      }
    };

    markNotificationsAsRead();
  }, [activeTab, unreadNotificationsCount]);

  return (
    <div className="h-full flex flex-col">
      <Tabs 
        defaultValue="messages" 
        className="flex-1 flex flex-col"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="messages" className="relative">
            <MessageSquare className="h-5 w-5" />
            {unreadMessagesCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-primary/10">
                {unreadMessagesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <Badge variant="secondary" className="absolute -top-2 -right-2 bg-primary/10">
                {unreadNotificationsCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <ListTodo className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="notes">
            <StickyNote className="h-5 w-5" />
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings2 className="h-5 w-5" />
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="messages" className="h-full">
            <MessagesTab />
          </TabsContent>

          <TabsContent value="notifications" className="h-full">
            <NotificationsTab />
          </TabsContent>

          <TabsContent value="tasks" className="h-full">
            <div className="p-4">
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
                onAdd={handleAddTodo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            </div>
          </TabsContent>

          <TabsContent value="notes" className="h-full">
            <div className="p-4">
              <NotesSection />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="h-full">
            <Settings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
