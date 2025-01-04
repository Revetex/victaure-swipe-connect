import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, ListTodo, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MessagesTabsProps {
  scrapedJobsCount?: number;
}

export function MessagesTabs({ scrapedJobsCount = 0 }: MessagesTabsProps) {
  return (
    <TabsList className="grid w-full grid-cols-3 mb-4">
      <TabsTrigger value="messages" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Chat
      </TabsTrigger>
      <TabsTrigger value="todos" className="flex items-center gap-2">
        <ListTodo className="h-4 w-4" />
        Tâches
      </TabsTrigger>
      <TabsTrigger value="jobs" className="flex items-center gap-2 relative">
        <Briefcase className="h-4 w-4" />
        Offres
        {scrapedJobsCount > 0 && (
          <Badge 
            variant="secondary" 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {scrapedJobsCount}
          </Badge>
        )}
      </TabsTrigger>
    </TabsList>
  );
}