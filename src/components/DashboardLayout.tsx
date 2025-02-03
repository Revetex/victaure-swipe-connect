import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useCallback } from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useDebounce } from "use-debounce";
import { useLocation } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardEditMode } from "./DashboardEditMode";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(3);
  const [isEditing, setIsEditing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { showConversation } = useReceiver();
  
  const [debouncedSetViewportHeight] = useDebounce(
    (height: number) => setViewportHeight(height),
    100
  );

  const [lastPageChange, setLastPageChange] = useState(Date.now());
  const THROTTLE_DELAY = 300;

  const handlePageChange = useCallback((page: number) => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(page);
      setLastPageChange(now);
      setIsEditing(false);
    }
  }, [lastPageChange]);

  const handleRequestChat = useCallback(() => {
    handlePageChange(2);
  }, [handlePageChange]);

  const isInConversation = location.pathname.includes('/messages') && showConversation;

  if (isInConversation) {
    return (
      <DashboardContent
        currentPage={currentPage}
        isEditing={isEditing}
        viewportHeight={viewportHeight}
        onEditStateChange={setIsEditing}
        onRequestChat={handleRequestChat}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <DashboardEditMode isEditing={isEditing} />
      
      <div className={`container mx-auto px-0 sm:px-4 ${isEditing ? 'pt-12' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <DashboardHeader 
            currentPage={currentPage}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
          />
          
          <AnimatePresence mode="wait">
            <motion.div 
              variants={itemVariants} 
              className="transform transition-all duration-300 w-full min-h-screen pt-16"
              style={{ 
                maxHeight: isEditing ? `calc(${viewportHeight}px - ${isMobile ? '140px' : '80px'})` : 'none',
                overflowY: isEditing ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: isEditing ? (isMobile ? '10rem' : '4rem') : '10rem'
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
        className={`fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50 lg:border-none lg:bg-transparent transition-all duration-300 ${
          isEditing && currentPage === 4 ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{ 
          height: isMobile ? '5rem' : '4rem',
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