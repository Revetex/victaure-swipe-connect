
import { ReactNode, memo } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  isEditing?: boolean;
  showFriendsList?: boolean;
  onToggleFriendsList?: () => void;
  onToolReturn?: () => void;
}

// Memoize the entire component to prevent unnecessary re-renders
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

  return (
    <div className="flex min-h-screen bg-background">
      {/* Navigation - optimized with display classes */}
      <div className="hidden lg:block">
        <Navigation />
      </div>
      
      {/* Main content */}
      <main className={cn(
        "flex-1 relative",
        "transition-all duration-200 ease-in-out",
        !isMobile && "pl-64"
      )}>
        {/* Fixed Header with better backdrop filter performance */}
        <header className={cn(
          "fixed top-0 right-0 z-40 h-16",
          "bg-background/95 backdrop-blur",
          "supports-[backdrop-filter]:bg-background/60 border-b",
          "w-full lg:w-[calc(100%-16rem)]",
          "transition-all duration-200"
        )}>
          <div className="flex items-center gap-4 h-full px-4">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px] lg:hidden">
                  <Navigation />
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
        </header>

        {/* Content area with optimized layout shifts */}
        <div className={cn(
          "pt-16 min-h-[calc(100vh-4rem)]",
          "transition-all duration-200"
        )}>
          <div className="max-w-7xl mx-auto px-4">
            {children}
          </div>
        </div>

        {/* Friends list overlay with optimized animations */}
        <AnimatePresence mode="wait" initial={false}>
          {showFriendsList && (
            <DashboardFriendsList 
              show={showFriendsList} 
              onClose={onToggleFriendsList}
            />
          )}
        </AnimatePresence>

        {/* Mobile navigation with better safe area handling */}
        {!isFriendsPage && isMobile && (
          <nav 
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
          >
            <div className="h-full px-4">
              {/* Mobile navigation content */}
            </div>
          </nav>
        )}
      </main>
    </div>
  );
}));
