import { UserCircle, MessageSquare, BriefcaseIcon } from "lucide-react";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function DashboardNavigation({ currentPage, onPageChange }: DashboardNavigationProps) {
  const getPageIcon = (page: number) => {
    switch (page) {
      case 1:
        return <UserCircle className="h-4 w-4" />;
      case 2:
        return <MessageSquare className="h-4 w-4" />;
      case 3:
        return <BriefcaseIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPageName = (page: number) => {
    switch (page) {
      case 1:
        return "Profil";
      case 2:
        return "M. Victaure";
      case 3:
        return "Emplois";
      default:
        return "";
    }
  };

  return (
    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20">
      {[1, 2, 3].map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
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
  );
}