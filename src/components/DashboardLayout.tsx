import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useCallback, useEffect, useRef } from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);

  // Debounce viewport height updates
  const [debouncedSetViewportHeight] = useDebounce(
    (height: number) => setViewportHeight(height),
    100
  );

  // Handle viewport height changes and keyboard
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      debouncedSetViewportHeight(vh);
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    
    // Handle mobile keyboard
    if (isMobile) {
      window.visualViewport?.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isMobile) {
        window.visualViewport?.removeEventListener('resize', handleResize);
      }
    };
  }, [debouncedSetViewportHeight, isMobile]);

  // Prevent body scroll when editing or showing chat on mobile
  useEffect(() => {
    if (isMobile && (isEditing || showingChat)) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobile, isEditing, showingChat]);

  const handlePageChange = useCallback((page: number) => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(page);
      setLastPageChange(now);
      setShowingChat(false);
      
      // Scroll to top on page change for mobile
      if (isMobile && contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [lastPageChange, isMobile]);

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
        ref={contentRef}
        key="dashboard-content"
        variants={itemVariants} 
        className="transform transition-all duration-300 w-full min-h-screen pb-40 md:pb-24"
        style={{ 
          maxHeight: isEditing ? viewportHeight : 'none',
          height: isMobile ? 'calc(var(--vh, 1vh) * 100)' : '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          willChange: 'transform',
          position: 'relative',
          zIndex: 1
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
        className={`fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 transition-all duration-300 ${
          !isEditing && !showingChat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        }`}
        style={{ 
          height: 'auto',
          paddingBottom: 'env(safe-area-inset-bottom)',
          willChange: 'transform, opacity',
          zIndex: 50
        }}
        initial={false}
        animate={{ 
          y: !isEditing && !showingChat ? 0 : '100%',
          opacity: !isEditing && !showingChat ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="container mx-auto px-4 py-2 h-16">
          <DashboardNavigation 
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </motion.nav>
    </DashboardContainer>
  );
}