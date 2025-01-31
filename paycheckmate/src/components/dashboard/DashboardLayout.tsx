import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useCallback } from "react";
import { DashboardNavigation } from "./DashboardNavigation";
import { DashboardContainer } from "./DashboardContainer";
import { DashboardContent } from "./DashboardContent";
import { useDebounce } from "use-debounce";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  const [debouncedSetViewportHeight] = useDebounce(
    (height: number) => setViewportHeight(height),
    100
  );

  const [lastPageChange, setLastPageChange] = useState(Date.now());
  const THROTTLE_DELAY = 300;

  const updateHeight = useCallback(() => {
    debouncedSetViewportHeight(window.innerHeight);
  }, [debouncedSetViewportHeight]);

  const handlePageChange = useCallback((page: number) => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(page);
      setLastPageChange(now);
      if (page !== 4) {
        setIsEditing(false);
      }
    }
  }, [lastPageChange]);

  const handleRequestChat = useCallback(() => {
    handlePageChange(2);
  }, [handlePageChange]);

  return (
    <div className="relative min-h-screen bg-background">
      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              variants={itemVariants} 
              className="transform transition-all duration-300 w-full"
              style={{ 
                maxHeight: isEditing ? viewportHeight : 'none',
                overflowY: isEditing ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: isEditing ? `${viewportHeight * 0.2}px` : '1rem'
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
        </div>
      </div>
      
      <nav 
        className={`fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50 transition-all duration-300 ${
          isEditing && currentPage === 4 ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{ 
          height: '4rem',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center max-w-7xl">
          <DashboardNavigation 
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </nav>
    </div>
  );
}