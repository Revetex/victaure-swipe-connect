import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useCallback } from "react";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { DashboardContainer } from "./dashboard/DashboardContainer";
import { DashboardContent } from "./dashboard/DashboardContent";
import { useViewportHeight } from "@/utils/layout/useViewportHeight";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const viewportHeight = useViewportHeight();

  const handleRequestChat = useCallback(() => {
    setCurrentPage(2);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleEditStateChange = useCallback((state: boolean) => {
    setIsEditing(state);
  }, []);

  return (
    <DashboardContainer containerVariants={containerVariants}>
      <AnimatePresence mode="sync">
        <motion.div 
          variants={itemVariants} 
          className="transform transition-all duration-300 w-full min-h-[calc(var(--vh,1vh)*100)] pb-40"
          style={{ 
            maxHeight: isEditing ? viewportHeight : 'none',
            overflowY: isEditing ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: isEditing ? `${viewportHeight * 0.2}px` : '10rem'
          }}
        >
          <DashboardContent
            currentPage={currentPage}
            isEditing={isEditing}
            viewportHeight={viewportHeight}
            onEditStateChange={handleEditStateChange}
            onRequestChat={handleRequestChat}
          />
        </motion.div>
      </AnimatePresence>
      
      {!isEditing && (
        <motion.nav 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-background/95 dark:bg-background/90 backdrop-blur-lg border-t border-border/50 dark:border-border/20 z-50 safe-area-bottom"
          style={{ 
            height: '4rem',
            paddingBottom: 'env(safe-area-inset-bottom)'
          }}
        >
          <div className="container mx-auto px-4 h-full flex items-center">
            <DashboardNavigation 
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </motion.nav>
      )}
    </DashboardContainer>
  );
}