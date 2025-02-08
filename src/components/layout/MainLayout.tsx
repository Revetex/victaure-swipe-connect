
import { ReactNode } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  isEditing?: boolean;
  showFriendsList?: boolean;
  onToggleFriendsList?: () => void;
  onToolReturn?: () => void;
}

// Memoized Navigation component to prevent unnecessary re-renders
const MemoizedNavigation = memo(Navigation);

// Animation variants for layout transitions
const layoutVariants = {
  initial: { 
    opacity: 0,
    y: 20 
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

export function MainLayout({ 
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

  // Sidebar component for better organization
  const Sidebar = () => (
    <aside 
      className="w-[280px] lg:w-[320px] fixed left-0 top-0 bottom-0 border-r bg-background/95 backdrop-blur z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <MemoizedNavigation />
    </aside>
  );

  // Mobile navigation component
  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px]">
        <MemoizedNavigation />
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Main Content Area */}
      <motion.main 
        className={cn(
          "flex-1 min-h-screen flex flex-col",
          !isMobile && "md:pl-[280px] lg:pl-[320px]"
        )}
        variants={layoutVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Header */}
        <header 
          className="h-16 border-b bg-background/95 backdrop-blur fixed top-0 left-0 right-0 z-40"
          role="banner"
        >
          <div className="container h-full mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isMobile && <MobileNav />}
              <DashboardHeader 
                title={title}
                showFriendsList={showFriendsList}
                onToggleFriendsList={onToggleFriendsList}
                isEditing={isEditing}
                onToolReturn={onToolReturn}
              />
            </div>
          </div>
        </header>

        {/* Main Content with padding-top to account for fixed header */}
        <motion.div 
          className="flex-1 pt-16"
          variants={layoutVariants}
        >
          {children}
        </motion.div>

        {/* Friends List Overlay */}
        <AnimatePresence mode="wait">
          {showFriendsList && (
            <DashboardFriendsList 
              show={showFriendsList} 
              onClose={onToggleFriendsList}
            />
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        {!isFriendsPage && (
          <nav 
            className={cn(
              "h-16 border-t bg-background/95 backdrop-blur sticky bottom-0 z-40",
              !isMobile && "md:ml-[280px] lg:ml-[320px]"
            )}
            style={{ 
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
            role="navigation"
            aria-label="Bottom navigation"
          >
            <div className="container mx-auto px-4 h-full">
              {/* Navigation content */}
            </div>
          </nav>
        )}
      </motion.main>
    </div>
  );
}
