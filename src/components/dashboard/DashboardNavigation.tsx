import { UserCircle, MessageSquare, BriefcaseIcon } from "lucide-react";

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
    <div className="container mx-auto px-4">
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
    </div>
  );
}