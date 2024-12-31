import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagesTab } from "./messages/tabs/MessagesTab";
import { NotificationsTab } from "./messages/tabs/NotificationsTab";
import { TodoSection } from "./todo/TodoSection";
import { Settings } from "./Settings";
import { PaymentBox } from "./dashboard/PaymentBox";
import { useTodoList } from "@/hooks/useTodoList";
import { MessageSquare, Bell, StickyNote, ListTodo, Settings as SettingsIcon, CreditCard } from "lucide-react";

export function Messages() {
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
    addTodo,
    toggleTodo,
    deleteTodo
  } = useTodoList();

  return (
    <Tabs defaultValue="messages" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="messages" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only">Messages</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center gap-2">
          <StickyNote className="h-4 w-4" />
          <span className="sr-only">Notes</span>
        </TabsTrigger>
        <TabsTrigger value="tasks" className="flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          <span className="sr-only">Tâches</span>
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="sr-only">Paiements</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <SettingsIcon className="h-4 w-4" />
          <span className="sr-only">Paramètres</span>
        </TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-hidden">
        <TabsContent value="messages" className="h-full">
          <MessagesTab />
        </TabsContent>
        <TabsContent value="notifications" className="h-full">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="notes" className="h-full">
          <TodoSection
            type="tasks"
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
        </TabsContent>
        <TabsContent value="tasks" className="h-full">
          <TodoSection
            type="tasks"
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
        </TabsContent>
        <TabsContent value="payments" className="h-full">
          <PaymentBox />
        </TabsContent>
        <TabsContent value="settings" className="h-full">
          <Settings />
        </TabsContent>
      </div>
    </Tabs>
  );
}