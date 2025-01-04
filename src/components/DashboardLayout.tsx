import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useEffect } from "react";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { DashboardContainer } from "./dashboard/DashboardContainer";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  // Handle iOS Safari viewport height
  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    // Initial trigger for iOS Safari
    setTimeout(updateHeight, 100);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

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
      style={{ 
        maxHeight: isEditing ? viewportHeight : `calc(${viewportHeight}px - 4rem)`,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="dashboard-card h-full">
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

  const renderCurrentPage = () => {
    if (currentPage === 1) {
      return (
        <div 
          className={`${isEditing ? 'fixed inset-0 z-50 bg-background/95 backdrop-blur-sm' : 'relative'}`}
          style={{ 
            height: isEditing ? viewportHeight : 'auto',
            overflowY: isEditing ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {renderDashboardSection(
            <VCard 
              onEditStateChange={setIsEditing}
              onRequestChat={handleRequestChat}
            />,
            'w-full h-full'
          )}
        </div>
      );
    }

    if (currentPage === 2 && !isEditing) {
      return renderDashboardSection(
        <Messages />,
        'w-full h-full'
      );
    }

    if (currentPage === 3 && !isEditing) {
      return renderDashboardSection(
        <SwipeJob />,
        'w-full h-full',
        false
      );
    }

    return null;
  };

  return (
    <DashboardContainer containerVariants={containerVariants}>
      <AnimatePresence mode="sync">
        {renderCurrentPage()}
      </AnimatePresence>
      
      {!isEditing && (
        <nav 
          className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50"
          style={{ 
            height: '4rem',
            paddingBottom: 'env(safe-area-inset-bottom)'
          }}
        >
          <div className="container mx-auto px-4 h-full flex items-center">
            <DashboardNavigation 
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </nav>
      )}
    </DashboardContainer>
  );
}