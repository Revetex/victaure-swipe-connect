import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useCallback, useEffect } from "react";
import { DashboardNavigation } from "@/components/dashboard/DashboardNavigation";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { NotificationsBox } from "@/components/notifications/NotificationsBox";
import { useDebounce } from "use-debounce";
import { Logo } from "@/components/Logo";
import { ProfileSearch } from "@/components/feed/ProfileSearch";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useReceiver } from "@/hooks/useReceiver";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(3);
  const [isEditing, setIsEditing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { showConversation } = useReceiver();
  
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
      setIsEditing(false);
    }
  }, [lastPageChange]);

  const handleRequestChat = useCallback(() => {
    handlePageChange(2);
  }, [handlePageChange]);

  const handleProfileSelect = (profile: any) => {
    if (profile?.id) {
      navigate(`/profile/${profile.id}`);
      setIsSearchOpen(false);
    }
  };

  const getPageTitle = (page: number) => {
    switch (page) {
      case 1:
        return "Profil";
      case 2:
        return "Messages";
      case 3:
        return "Emplois";
      case 4:
        return "Actualités";
      case 5:
        return "Outils";
      case 6:
        return "Paramètres";
      default:
        return "";
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
    <div className="relative min-h-screen bg-background">
      {isEditing && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 py-2">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-center text-sm font-medium text-muted-foreground">
                Mode édition
              </h1>
            </div>
          </div>
        </div>
      )}
      
      <div className={`container mx-auto px-0 sm:px-4 ${isEditing ? 'pt-12' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-2 px-4 border-b">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Logo size="sm" />
                <h1 className="text-xl font-bold text-primary">VICTAURE</h1>
              </div>
              <div className="h-6 w-px bg-border mx-2" />
              <h2 className="text-lg font-semibold text-foreground">
                {getPageTitle(currentPage)}
              </h2>
            </div>
            
            <div className="flex items-center gap-4">
              {isMobile ? (
                <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground">
                      <Search className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="top" className="w-full p-4">
                    <ProfileSearch 
                      onSelect={handleProfileSelect}
                      placeholder="Rechercher un profil..."
                      className="w-full"
                    />
                  </SheetContent>
                </Sheet>
              ) : (
                <div className="w-[300px]">
                  <ProfileSearch 
                    onSelect={handleProfileSelect}
                    placeholder="Rechercher un profil..."
                    className="w-full"
                  />
                </div>
              )}
              <NotificationsBox />
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div 
              variants={itemVariants} 
              className="transform transition-all duration-300 w-full min-h-screen"
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