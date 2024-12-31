import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagesTab } from "./messages/tabs/MessagesTab";
import { NotificationsTab } from "./messages/tabs/NotificationsTab";
import { TodoSection } from "./todo/TodoSection";
import { Settings } from "./Settings";
import { PaymentBox } from "./dashboard/PaymentBox";

export function Messages() {
  return (
    <Tabs defaultValue="messages" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="tasks">Tâches</TabsTrigger>
        <TabsTrigger value="settings">Paramètres</TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-hidden">
        <TabsContent value="messages" className="h-full">
          <MessagesTab />
        </TabsContent>
        <TabsContent value="notifications" className="h-full">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="notes" className="h-full">
          <TodoSection type="notes" />
        </TabsContent>
        <TabsContent value="tasks" className="h-full">
          <TodoSection type="tasks" />
        </TabsContent>
        <TabsContent value="settings" className="h-full">
          <Settings />
        </TabsContent>
      </div>
    </Tabs>
  );
}