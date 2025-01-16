import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useCallback, useEffect } from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useDebounce } from "use-debounce";

const THROTTLE_DELAY = 300; // ms

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [lastPageChange, setLastPageChange] = useState(0);
  const [showingChat, setShowingChat] = useState(false);

  // Debounce viewport height updates
  const [debouncedSetViewportHeight] = useDebounce(
    (height: number) => setViewportHeight(height),
    100
  );

  // Handle viewport height changes
  useEffect(() => {
    const handleResize = () => {
      debouncedSetViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [debouncedSetViewportHeight]);

  const handlePageChange = useCallback((page: number) => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(page);
      setLastPageChange(now);
      setShowingChat(false);
    }
  }, [lastPageChange]);

  const handleRequestChat = useCallback(() => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(2);
      setLastPageChange(now);
      setShowingChat(true);
    }
  }, [lastPageChange]);

  return (
    <DashboardContainer containerVariants={containerVariants}>
      <motion.div 
        key="dashboard-content"
        variants={itemVariants} 
        className="transform transition-all duration-300 w-full min-h-screen pb-40"
        style={{ 
          maxHeight: isEditing ? viewportHeight : 'none',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          willChange: 'transform'
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <DashboardContent
            key={`page-${currentPage}`}
            currentPage={currentPage}
            isEditing={isEditing}
            viewportHeight={viewportHeight}
            onEditStateChange={setIsEditing}
            onRequestChat={handleRequestChat}
          />
        </AnimatePresence>
      </motion.div>
      
      <motion.nav 
        className={`fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50 transition-all duration-300 ${
          !isEditing && !showingChat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        }`}
        style={{ 
          height: '4rem',
          paddingBottom: 'env(safe-area-inset-bottom)',
          willChange: 'transform, opacity'
        }}
        initial={false}
        animate={{ 
          y: !isEditing && !showingChat ? 0 : '100%',
          opacity: !isEditing && !showingChat ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="container mx-auto px-4 h-full flex items-center">
          <DashboardNavigation 
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </motion.nav>
    </DashboardContainer>
  );
}