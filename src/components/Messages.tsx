import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagesTab } from "./messages/tabs/MessagesTab";
import { NotificationsTab } from "./messages/tabs/NotificationsTab";
import { TodoSection } from "./todo/TodoSection";
import { Settings } from "./Settings";
import { PaymentBox } from "./dashboard/PaymentBox";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";
import { NotesSection } from "./todo/NotesSection";
import { 
  MessageSquare, 
  Bell, 
  StickyNote, 
  ListTodo, 
  Settings as SettingsIcon, 
  CreditCard 
} from "lucide-react";

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

  const {
    notes,
    newNote,
    selectedColor,
    setNewNote,
    setSelectedColor,
    addNote,
    deleteNote
  } = useNotes();

  const colors = [
    { value: 'yellow', label: 'Jaune', class: 'bg-yellow-200' },
    { value: 'blue', label: 'Bleu', class: 'bg-blue-200' },
    { value: 'green', label: 'Vert', class: 'bg-green-200' },
    { value: 'pink', label: 'Rose', class: 'bg-pink-200' },
    { value: 'purple', label: 'Violet', class: 'bg-purple-200' },
    { value: 'peach', label: 'Pêche', class: 'bg-orange-200' },
    { value: 'gray', label: 'Gris', class: 'bg-gray-200' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-300' },
  ];

  return (
    <Tabs defaultValue="messages" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <TabsTrigger value="messages" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Messages</span>
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="notes" className="flex items-center gap-2">
          <StickyNote className="h-4 w-4" />
          <span className="hidden sm:inline">Notes</span>
        </TabsTrigger>
        <TabsTrigger value="tasks" className="flex items-center gap-2">
          <ListTodo className="h-4 w-4" />
          <span className="hidden sm:inline">Tâches</span>
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Paiements</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <SettingsIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Paramètres</span>
        </TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-hidden bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
        <TabsContent value="messages" className="h-full">
          <MessagesTab />
        </TabsContent>
        <TabsContent value="notifications" className="h-full">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="notes" className="h-full">
          <NotesSection
            notes={notes}
            newNote={newNote}
            selectedColor={selectedColor}
            colors={colors}
            onNoteChange={setNewNote}
            onColorChange={setSelectedColor}
            onAdd={addNote}
            onDelete={deleteNote}
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