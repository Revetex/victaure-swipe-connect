import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useCallback, useEffect } from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useDebounce } from "use-debounce";
import { useNavigate, useLocation } from "react-router-dom";
import { useReceiver } from "@/hooks/useReceiver";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardContainer } from "./dashboard/DashboardContainer";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(3);
  const [isEditing, setIsEditing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const navigate = useNavigate();
  const location = useLocation();
  const { showConversation } = useReceiver();
  const [showFriendsList, setShowFriendsList] = useState(false);
  
  const [debouncedSetViewportHeight] = useDebounce(
    (height: number) => setViewportHeight(height),
    100
  );

  const [lastPageChange, setLastPageChange] = useState(Date.now());
  const THROTTLE_DELAY = 300;

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.getElementsByTagName('head')[0].appendChild(meta);

    const handleResize = () => {
      debouncedSetViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [debouncedSetViewportHeight]);

  const handlePageChange = useCallback((page: number) => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(page);
      setLastPageChange(now);
      setIsEditing(false);
      if (isMobile) {
        setShowFriendsList(false);
      }
    }
  }, [lastPageChange, isMobile]);

  const handleRequestChat = useCallback(() => {
    handlePageChange(2);
  }, [handlePageChange]);

  const getPageTitle = (page: number) => {
    switch (page) {
      case 1: return "Profil";
      case 2: return "Messages";
      case 3: return "Emplois";
      case 4: return "Actualités";
      case 5: return "Outils";
      case 6: return "Paramètres";
      default: return "";
    }
  };

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
    <DashboardContainer
      isEditing={isEditing}
      viewportHeight={viewportHeight}
      isMobile={isMobile}
    >
      <DashboardHeader
        pageTitle={getPageTitle(currentPage)}
        showFriendsList={showFriendsList}
        isMobile={isMobile}
        onFriendsListToggle={() => setShowFriendsList(!showFriendsList)}
      />
      
      <AnimatePresence mode="wait">
        <motion.div 
          variants={itemVariants} 
          className="transform transition-all duration-300 w-full min-h-screen pt-16"
          style={{ 
            maxHeight: isEditing ? `calc(${viewportHeight}px - ${isMobile ? '140px' : '80px'})` : 'none',
            overflowY: isEditing ? 'auto' : 'visible',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: isMobile ? '4rem' : '3rem',
            height: isMobile ? `${viewportHeight}px` : 'auto'
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
      
      <nav 
        className={`fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50 lg:border-none lg:bg-transparent transition-all duration-300 ${
          isEditing && currentPage === 4 ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{ 
          height: 'auto',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingTop: '0'
        }}
      >
        <div className="container mx-auto px-4 py-2 h-full flex items-center max-w-7xl">
          <DashboardNavigation 
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </nav>
    </DashboardContainer>
  );
}