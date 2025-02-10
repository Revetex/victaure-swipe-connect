
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
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
        "safe-bottom" // Ajout de la classe pour le safe area bottom
      )}
    >
      <div className="container mx-auto h-16 flex items-center">
        <DashboardNavigation 
          currentPage={currentPage}
          onPageChange={onPageChange}
          isEditing={isEditing}
        />
      </div>
    </nav>
  );
}
