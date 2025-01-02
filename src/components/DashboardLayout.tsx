import { useIsMobile } from "@/hooks/use-mobile";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState } from "react";
import { MrVictaureWelcome } from "./dashboard/MrVictaureWelcome";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { DashboardNavigationArrows } from "./dashboard/DashboardNavigationArrows";
import { DashboardContent } from "./dashboard/DashboardContent";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const [showMVictor, setShowMVictor] = useState(true);

  const handleSwipe = (direction: number) => {
    if (isEditing) return;
    let newPage = currentPage + direction;
    if (newPage < 1) newPage = 3;
    if (newPage > 3) newPage = 1;
    setCurrentPage(newPage);
  };

  const handleRequestChat = () => {
    setCurrentPage(2);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      {showMVictor && (
        <MrVictaureWelcome 
          onDismiss={() => setShowMVictor(false)}
          onStartChat={() => {
            setCurrentPage(2);
            setShowMVictor(false);
          }}
        />
      )}

      <div className="relative flex-1 overflow-y-auto">
        {!isEditing && (
          <DashboardNavigationArrows onSwipe={handleSwipe} />
        )}

        <div className="container mx-auto px-4 h-full py-6 pb-72">
          <DashboardContent 
            currentPage={currentPage}
            isEditing={isEditing}
            containerVariants={containerVariants}
            itemVariants={itemVariants}
            onEditStateChange={setIsEditing}
            onRequestChat={handleRequestChat}
          />
        </div>

        {!isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 py-4">
            <DashboardNavigation 
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}