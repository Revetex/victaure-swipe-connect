import { CreditCard, Settings, MessageSquare, ListTodo, StickyNote } from "lucide-react";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardNavigation({ currentPage, onPageChange }: DashboardNavigationProps) {
  const getPageIcon = (page: number) => {
    switch (page) {
      case 1:
        return <MessageSquare className="h-4 w-4" />;
      case 2:
        return <ListTodo className="h-4 w-4" />;
      case 3:
        return <StickyNote className="h-4 w-4" />;
      case 4:
        return <CreditCard className="h-4 w-4" />;
      case 5:
        return <Settings className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPageName = (page: number) => {
    switch (page) {
      case 1:
        return "Messages";
      case 2:
        return "Tâches";
      case 3:
        return "Notes";
      case 4:
        return "Paiements";
      case 5:
        return "Paramètres";
      default:
        return "";
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between gap-2">
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              currentPage === page 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background/80 hover:bg-background/90 backdrop-blur-sm'
            }`}
          >
            {getPageIcon(page)}
            <span className="text-sm font-medium">{getPageName(page)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}