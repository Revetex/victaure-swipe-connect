import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Bell, 
  StickyNote, 
  ListTodo, 
  Settings as SettingsIcon, 
  CreditCard 
} from "lucide-react";

export function MessagesTabs() {
  return (
    <TabsList className="grid w-full grid-cols-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-50">
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
  );
}