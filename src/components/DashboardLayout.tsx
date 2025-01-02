import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState } from "react";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(2);
  const [isEditing, setIsEditing] = useState(false);

  const handleRequestChat = () => {
    setCurrentPage(2);
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
      <div className="dashboard-card h-full relative">
        {padding ? (
          <div className="p-3 sm:p-4 md:p-6 h-full">
            {component}
          </div>
        ) : (
          component
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 pb-24">
          <motion.div 
            className="max-w-[1200px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentPage === 1 && (
              <div className={isEditing ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 overflow-auto" : "relative"}>
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
      </main>

      {!isEditing && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 py-4 z-50">
          <div className="container mx-auto px-4">
            <DashboardNavigation 
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </nav>
      )}
    </div>
  );
}