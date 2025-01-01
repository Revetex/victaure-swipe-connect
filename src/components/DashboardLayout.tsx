import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { MrVictaureWelcome } from "./dashboard/MrVictaureWelcome";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(2); // Start with M. Victaure page
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
    setCurrentPage(2); // Switch to chat page
  };

  const renderDashboardSection = (
    component: React.ReactNode,
    className: string,
    padding: boolean = true
  ) => (
    <motion.div 
      variants={itemVariants} 
      className={`transform transition-all duration-300 ${className}`}
    >
      <div className="dashboard-card h-full">
        {padding ? (
          <div className="p-3 sm:p-4 md:p-6 h-full overflow-hidden">{component}</div>
        ) : (
          component
        )}
      </div>
    </motion.div>
  );

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

      <div className="relative z-10 flex-1 overflow-hidden">
        {!isEditing && (
          <>
            <div className="absolute top-1/2 left-4 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => handleSwipe(-1)}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute top-1/2 right-4 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => handleSwipe(1)}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </>
        )}

        <div className="container mx-auto px-4 h-full py-6">
          <motion.div 
            className="h-full max-w-[1200px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentPage === 1 && (
              <div className={isEditing ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 overflow-auto" : ""}>
                {renderDashboardSection(
                  <VCard 
                    onEditStateChange={setIsEditing}
                    onRequestChat={handleRequestChat}
                  />,
                  'w-full h-full'
                )}
              </div>
            )}
            
            {currentPage === 2 && !isEditing && renderDashboardSection(
              <Messages />,
              'w-full h-full'
            )}
            
            {currentPage === 3 && !isEditing && renderDashboardSection(
              <SwipeJob />,
              'w-full h-full',
              false
            )}
          </motion.div>
        </div>

        {!isEditing && (
          <DashboardNavigation 
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}