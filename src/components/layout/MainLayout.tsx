
import { ReactNode } from "react";
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

  return (
    <div className="flex min-h-screen bg-background">
      {/* Navigation desktop */}
      {!isMobile && (
        <nav className="w-[280px] lg:w-[320px] fixed left-0 top-0 bottom-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Navigation />
        </nav>
      )}

      {/* Main content */}
      <main className={cn(
        "flex-1 relative",
        !isMobile && "ml-[280px] lg:ml-[320px]"
      )}>
        {/* Fixed Header */}
        <header className="fixed top-0 right-0 z-50 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className={cn(
            "flex items-center gap-4 h-full px-4",
            !isMobile && "ml-[280px] lg:ml-[320px]"
          )}>
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px]">
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

        {/* Content area with correct spacing */}
        <div className="pt-16">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>

        {/* Friends list overlay - adjusted z-index */}
        <AnimatePresence mode="wait">
          {showFriendsList && (
            <DashboardFriendsList 
              show={showFriendsList} 
              onClose={onToggleFriendsList}
            />
          )}
        </AnimatePresence>

        {/* Mobile navigation */}
        {!isFriendsPage && isMobile && (
          <nav 
            className="h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed bottom-0 left-0 right-0 z-50"
            style={{ 
              paddingBottom: 'env(safe-area-inset-bottom)'
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
}

