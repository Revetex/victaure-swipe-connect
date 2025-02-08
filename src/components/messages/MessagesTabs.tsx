import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessagesTab } from "./tabs/MessagesTab";

interface MessagesTabsProps {
  activeTab: "messages";
  onTabChange: (value: "messages") => void;
}

export function MessagesTabs({ activeTab, onTabChange }: MessagesTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="h-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>
      <TabsContent value="messages" className="h-[calc(100%-2.5rem)]">
        <MessagesTab />
      </TabsContent>
    </Tabs>
  );
}