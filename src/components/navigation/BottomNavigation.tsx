
import { DashboardNavigation } from "@/components/dashboard/navigation/DashboardNavigation";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  isEditing?: boolean;
}

export function BottomNavigation({ 
  currentPage, 
  onPageChange,
  isEditing 
}: BottomNavigationProps) {
  return (
    <nav 
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-40 shadow-lg",
        "pb-safe pt-2 px-2" // Added padding for safe area
      )}
    >
      <div className="container mx-auto">
        <DashboardNavigation 
          currentPage={currentPage}
          onPageChange={onPageChange}
          isEditing={isEditing}
          className="flex justify-around items-center"
        />
      </div>
    </nav>
  );
}
