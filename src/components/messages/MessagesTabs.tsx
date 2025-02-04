import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagesTab } from "./tabs/MessagesTab";
import { NotificationsTab } from "./tabs/NotificationsTab";

interface MessagesTabsProps {
  activeTab: "messages" | "notifications";
  onTabChange: (value: "messages" | "notifications") => void;
}

export function MessagesTabs({ activeTab, onTabChange }: MessagesTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="h-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="messages" className="h-[calc(100%-2.5rem)]">
        <MessagesTab />
      </TabsContent>
      <TabsContent value="notifications" className="h-[calc(100%-2.5rem)]">
        <NotificationsTab />
      </TabsContent>
    </Tabs>
  );
}