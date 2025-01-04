import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ListTodo } from "lucide-react";

export function MessagesTabs() {
  return (
    <TabsList className="grid w-full grid-cols-2 mb-4">
      <TabsTrigger value="messages" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Chat
      </TabsTrigger>
      <TabsTrigger value="todos" className="flex items-center gap-2">
        <ListTodo className="h-4 w-4" />
        Tâches
      </TabsTrigger>
    </TabsList>
  );
}