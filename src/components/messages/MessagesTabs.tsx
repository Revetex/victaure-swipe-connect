import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ListTodo, StickyNote } from "lucide-react";

export function MessagesTabs() {
  return (
    <TabsList className="grid w-full grid-cols-3 h-12">
      <TabsTrigger value="assistant" className="data-[state=active]:bg-muted">
        <MessageSquare className="h-4 w-4 mr-2" />
        Assistant
      </TabsTrigger>
      <TabsTrigger value="todos" className="data-[state=active]:bg-muted">
        <ListTodo className="h-4 w-4 mr-2" />
        Tâches
      </TabsTrigger>
      <TabsTrigger value="notes" className="data-[state=active]:bg-muted">
        <StickyNote className="h-4 w-4 mr-2" />
        Notes
      </TabsTrigger>
    </TabsList>
  );
}