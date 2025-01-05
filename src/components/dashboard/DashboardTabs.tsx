import { MessageSquare } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardTabs() {
  return (
    <TabsList className="grid w-full grid-cols-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 left-0 right-0 z-50">
      <TabsTrigger value="messages" className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Messages</span>
      </TabsTrigger>
    </TabsList>
  );
}