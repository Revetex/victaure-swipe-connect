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

  useEffect(() => {
    if (isMobile && (isEditing || showingChat)) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
      };
    }
  }, [isMobile, isEditing, showingChat]);

  const handlePageChange = useCallback((page: number): number => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(page);
      setLastPageChange(now);
      setShowingChat(false);
      
      if (isMobile && contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    return page;
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
        className="transform-gpu w-full min-h-screen pb-safe safe-area-top"
        style={{ 
          height: isMobile ? 'calc(var(--vh, 1vh) * 100)' : '100vh',
          overflowY: isEditing ? 'hidden' : 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          willChange: 'transform',
          position: 'relative',
          zIndex: 1,
          paddingBottom: isMobile ? 'calc(4rem + env(safe-area-inset-bottom))' : '4rem'
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
        className={`fixed bottom-0 left-0 right-0 border-t border-border/50 transition-all duration-300 safe-area-bottom ${
          !isEditing && !showingChat ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
        }`}
        style={{ 
          height: 'auto',
          willChange: 'transform, opacity',
          zIndex: 50,
          backgroundColor: '#1A1F2C',
          paddingBottom: 'env(safe-area-inset-bottom)'
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
