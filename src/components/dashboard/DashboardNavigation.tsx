import { UserCircle, MessageSquare, BriefcaseIcon, Bell, ListTodo, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardNavigation({ currentPage, onPageChange }: DashboardNavigationProps) {
  const navigationItems = [
    { id: 1, icon: UserCircle, name: "Profil" },
    { id: 2, icon: MessageSquare, name: "M. Victaure" },
    { id: 3, icon: BriefcaseIcon, name: "Emplois" }
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <div className="flex justify-center gap-4">
          {navigationItems.map(({ id, icon: Icon, name }) => (
            <button
              key={id}
              onClick={() => onPageChange(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                currentPage === id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background/80 hover:bg-background/90 backdrop-blur-sm'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{name}</span>
            </button>
          ))}
        </div>

        <Tabs defaultValue="notifications" className="h-full">
          <TabsList className="bg-transparent border-none shadow-none">
            <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="tasks-notes" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">Tâches/Notes</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}