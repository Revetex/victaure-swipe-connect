import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useEffect, useCallback } from "react";
import { DashboardNavigation } from "./DashboardNavigation";
import { DashboardContainer } from "./DashboardContainer";
import { DashboardContent } from "./DashboardContent";
import { useDebounce } from "use-debounce";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  // Debounce viewport height updates
  const [debouncedSetViewportHeight] = useDebounce(
    (height: number) => setViewportHeight(height),
    100
  );

  // Throttle page changes
  const [lastPageChange, setLastPageChange] = useState(Date.now());
  const THROTTLE_DELAY = 300; // milliseconds

  const updateHeight = useCallback(() => {
    debouncedSetViewportHeight(window.innerHeight);
  }, [debouncedSetViewportHeight]);

  useEffect(() => {
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);

    const timeoutId = setTimeout(updateHeight, 100);

    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
      clearTimeout(timeoutId);
    };
  }, [updateHeight]);

  const handlePageChange = useCallback((page: number) => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(page);
      setLastPageChange(now);
    }
  }, [lastPageChange]);

  const handleRequestChat = useCallback(() => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(2);
      setLastPageChange(now);
    }
  }, [lastPageChange]);

  return (
    <DashboardContainer containerVariants={containerVariants}>
      <AnimatePresence mode="sync">
        <motion.div 
          variants={itemVariants} 
          className="transform transition-all duration-300 w-full min-h-screen pb-40"
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
            onEditStateChange={setIsEditing}
            onRequestChat={handleRequestChat}
          />
        </motion.div>
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
              onPageChange={handlePageChange}
            />
          </div>
        </nav>
      )}
    </DashboardContainer>
  );
}