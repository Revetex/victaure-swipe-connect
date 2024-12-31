import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagesTab } from "./messages/tabs/MessagesTab";
import { NotificationsTab } from "./messages/tabs/NotificationsTab";
import { AssistantTab } from "./messages/tabs/AssistantTab";

export function Messages() {
  return (
    <Tabs defaultValue="messages" className="h-full flex flex-col">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="assistant">Assistant</TabsTrigger>
      </TabsList>
      <div className="flex-1 overflow-hidden">
        <TabsContent value="messages" className="h-full">
          <MessagesTab />
        </TabsContent>
        <TabsContent value="notifications" className="h-full">
          <NotificationsTab />
        </TabsContent>
        <TabsContent value="assistant" className="h-full">
          <AssistantTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}