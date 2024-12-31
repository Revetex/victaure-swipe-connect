import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMessages } from "@/hooks/useMessages";
import { MessagesTab } from "./messages/tabs/MessagesTab";
import { NotificationsTab } from "./messages/tabs/NotificationsTab";
import { Settings } from "./Settings";
import { MessageSquare, Bell, Settings2, ListTodo, StickyNote } from "lucide-react";
import { TodoSection } from "./todo/TodoSection";
import { NotesSection } from "./todo/NotesSection";
import { useTodos } from "@/hooks/useTodos";
import { useNotifications } from "@/hooks/useNotifications";

export function Messages() {
  const { messages: userMessages } = useMessages();
  const { notifications, activeTab, setActiveTab, unreadNotificationsCount } = useNotifications();
  const {
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
  } = useTodos();

  const unreadMessagesCount = userMessages.filter(m => !m.read).length;

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