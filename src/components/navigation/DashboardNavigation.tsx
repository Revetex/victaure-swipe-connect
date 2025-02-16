
import { cn } from "@/lib/utils";
import { navigationItems } from "@/config/navigation";

interface DashboardNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  isEditing?: boolean;
  className?: string;
}

export function DashboardNavigation({ 
  currentPage, 
  onPageChange,
  isEditing,
  className 
}: DashboardNavigationProps) {
  if (isEditing) return null;

  return (
    <div className={cn(
      "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2 p-4",
      "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t",
      "lg:relative lg:border-t-0 lg:bg-transparent",
      "pb-safe-bottom", // Pour iOS safe area
      className
    )}>
      {navigationItems.map(({ id, icon: Icon, name }) => (
        <button
          key={id}
          onClick={() => onPageChange(id)}
          className={cn(
            "flex flex-col items-center justify-center gap-1",
            "p-2 rounded-lg transition-all duration-200",
            "hover:bg-primary/10 active:scale-95",
            "touch-manipulation min-h-[44px] min-w-[44px]",
            currentPage === id
              ? "bg-primary text-primary-foreground shadow-lg"
              : "text-muted-foreground hover:text-primary"
          )}
          title={name}
          aria-label={name}
        >
          <Icon className="h-5 w-5" />
          <span className="text-xs font-medium truncate w-full text-center">
            {name}
          </span>
        </button>
      ))}
    </div>
  );
}
