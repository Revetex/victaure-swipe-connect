import { useCallback, useEffect, useRef, useState } from "react";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { DashboardPageContent } from "./dashboard/DashboardPageContent";
import { useViewportHeight } from "@/hooks/useViewportHeight";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useTodoList } from "@/hooks/useTodoList";
import { useNotes } from "@/hooks/useNotes";

interface DashboardLayoutProps {
  initialPage?: number;
}

export function DashboardLayout({ initialPage = 1 }: DashboardLayoutProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [lastPageChange, setLastPageChange] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showingChat, setShowingChat] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const viewportHeight = useViewportHeight();
  const isMobile = useIsMobile();
  const todoProps = useTodoList();
  const noteProps = useNotes();

  useEffect(() => {
    if (isMobile && Math.abs(Date.now() - lastPageChange) < 1000) {
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [lastPageChange, isMobile]);

  const handleRequestChat = useCallback(() => {
    setShowingChat(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setLastPageChange(Date.now());
  }, []);

  const handleEditStateChange = useCallback((state: boolean) => {
    setIsEditing(state);
  }, []);

  return (
    <div 
      className="relative min-h-screen bg-background text-foreground overflow-hidden"
      style={{ height: `${viewportHeight}px` }}
    >
      <motion.div 
        ref={contentRef}
        className="h-full overflow-y-auto pb-24 overscroll-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <DashboardPageContent
          currentPage={currentPage}
          isEditing={isEditing}
          viewportHeight={viewportHeight}
          onEditStateChange={handleEditStateChange}
          onRequestChat={handleRequestChat}
          todoProps={todoProps}
          noteProps={noteProps}
        />
      </motion.div>
      
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 border-t border-border bg-background shadow-lg"
        style={{ 
          height: 'auto',
          willChange: 'transform, opacity',
          zIndex: 50,
          transform: !isEditing && !showingChat ? 'translateY(0)' : 'translateY(100%)',
          opacity: !isEditing && !showingChat ? 1 : 0,
          pointerEvents: !isEditing && !showingChat ? 'auto' : 'none',
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
        initial={false}
      >
        <div className="container max-w-md mx-auto px-4 py-2">
          <DashboardNavigation
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </motion.nav>
    </div>
  );
}