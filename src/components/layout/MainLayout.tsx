
import { ReactNode, memo, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  isEditing?: boolean;
  showFriendsList?: boolean;
  onToggleFriendsList?: () => void;
  onToolReturn?: () => void;
}

// Optimized layout component with performance improvements
export const MainLayout = memo(function MainLayout({ 
  children, 
  title = "", 
  isEditing = false,
  showFriendsList = false,
  onToggleFriendsList = () => {},
  onToolReturn = () => {}
}: MainLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const isFriendsPage = location.pathname.includes('/friends');

  // Memoize the navigation toggle handler
  const handleNavigationToggle = useCallback(() => {
    // Navigation toggle logic here
  }, []);

  return (
    <motion.div 
      className="flex min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Main content with optimized layout structure */}
      <main className={cn(
        "flex-1 relative",
        "transition-all duration-200 ease-in-out"
      )}>
        {/* Header with optimized backdrop and animations */}
        <motion.header 
          className={cn(
            "fixed top-0 right-0 z-40 h-16",
            "bg-background/95 backdrop-blur",
            "supports-[backdrop-filter]:bg-background/60 border-b",
            "w-full",
            "transition-all duration-200"
          )}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4 h-full px-4">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleNavigationToggle}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="left" 
                  className="p-0 w-[280px] lg:hidden"
                >
                  {children}
                </SheetContent>
              </Sheet>
            )}
            <DashboardHeader 
              title={title}
              showFriendsList={showFriendsList}
              onToggleFriendsList={onToggleFriendsList}
              isEditing={isEditing}
              onToolReturn={onToolReturn}
            />
          </div>
        </motion.header>

        {/* Content area with improved layout and animations */}
        <motion.div 
          className={cn(
            "pt-16 min-h-[calc(100vh-4rem)]",
            "transition-all duration-200"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="max-w-7xl mx-auto px-4">
            {children}
          </div>
        </motion.div>

        {/* Friends list overlay with improved animations */}
        <AnimatePresence mode="wait" initial={false}>
          {showFriendsList && (
            <DashboardFriendsList 
              show={showFriendsList} 
              onClose={onToggleFriendsList}
            />
          )}
        </AnimatePresence>

        {/* Mobile navigation with improved safe area handling */}
        {!isFriendsPage && isMobile && (
          <motion.nav 
            className={cn(
              "h-16 border-t fixed bottom-0 left-0 right-0 z-50",
              "bg-background/95 backdrop-blur",
              "supports-[backdrop-filter]:bg-background/60",
              "transition-all duration-200"
            )}
            style={{ 
              paddingBottom: 'env(safe-area-inset-bottom)',
              height: 'calc(4rem + env(safe-area-inset-bottom))'
            }}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-full px-4">
              {/* Mobile navigation content */}
            </div>
          </motion.nav>
        )}
      </main>
    </motion.div>
  );
}));
