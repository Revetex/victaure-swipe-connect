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
    <div className="w-full flex justify-between items-center gap-4">
      <div className="flex gap-2">
        {navigationItems.map(({ id, icon: Icon, name }) => (
          <button
            key={id}
            onClick={() => onPageChange(id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
              currentPage === id 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background/80 hover:bg-background/90 backdrop-blur-sm'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium hidden sm:inline">{name}</span>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 bg-background/80 hover:bg-background/90 backdrop-blur-sm">
          <Bell className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">Notifications</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 bg-background/80 hover:bg-background/90 backdrop-blur-sm">
          <ListTodo className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">Tâches/Notes</span>
        </button>
        <button className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 bg-background/80 hover:bg-background/90 backdrop-blur-sm">
          <Settings className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">Paramètres</span>
        </button>
      </div>
    </div>
  );
}