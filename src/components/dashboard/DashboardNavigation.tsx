import { UserCircle, MessageSquare, BriefcaseIcon, Settings, ClipboardList } from "lucide-react";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardNavigation({ currentPage, onPageChange }: DashboardNavigationProps) {
  const navigationItems = [
    { id: 1, icon: UserCircle, name: "Profil" },
    { id: 2, icon: MessageSquare, name: "Messages" },
    { id: 3, icon: BriefcaseIcon, name: "Emplois" },
    { id: 4, icon: ClipboardList, name: "Tâches/Notes" },
    { id: 5, icon: Settings, name: "Paramètres" }
  ];

  return (
    <div className="w-full flex justify-between items-center px-4">
      {navigationItems.map(({ id, icon: Icon, name }) => (
        <button
          key={id}
          onClick={() => onPageChange(id)}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
            currentPage === id 
              ? 'text-primary bg-primary/10' 
              : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
          }`}
        >
          <Icon className="h-5 w-5" />
          <span className="text-xs font-medium">{name}</span>
        </button>
      ))}
    </div>
  );
}