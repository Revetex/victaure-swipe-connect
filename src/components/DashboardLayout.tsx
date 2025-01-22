import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useCallback, useEffect, useRef } from "react";
import { DashboardNavigation } from "./dashboard/layout/DashboardNavigation";
import { DashboardContainer } from "./dashboard/layout/DashboardContainer";
import { DashboardContent } from "./dashboard/layout/DashboardContent";
import { useDebounce } from "use-debounce";

const THROTTLE_DELAY = 300;

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [lastPageChange, setLastPageChange] = useState(0);
  const [showingChat, setShowingChat] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [debouncedSetViewportHeight] = useDebounce(
    (height: number) => setViewportHeight(height),
    100
  );

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      debouncedSetViewportHeight(vh);
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
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

  const handlePageChange = useCallback((page: number) => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(page);
      setLastPageChange(now);
      setShowingChat(false);
      setIsEditing(false);
      
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
        className="transform-gpu w-full min-h-screen pb-safe"
        style={{ 
          height: isMobile ? 'calc(var(--vh, 1vh) * 100)' : '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          willChange: 'transform',
          position: 'relative',
          zIndex: 1,
          paddingBottom: isMobile ? 'calc(4rem + env(safe-area-inset-bottom))' : '4rem'
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
      
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/50 transition-all duration-300 z-50 safe-area-bottom"
        style={{ 
          height: 'auto',
          willChange: 'transform, opacity',
        }}
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