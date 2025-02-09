
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/components/navigation/AppHeader";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useEffect, useRef } from "react";

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
  const mainRef = useRef<HTMLDivElement>(null);

  // Cleanup resize observers when component unmounts
  useEffect(() => {
    return () => {
      if (mainRef.current) {
        const observers = Array.from(mainRef.current.querySelectorAll('.scroll-area'))
          .map(el => el['_reszieObserver'])
          .filter(Boolean);
        
        observers.forEach(observer => observer.disconnect());
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar Navigation */}
      {!isMobile && (
        <aside className="w-[280px] lg:w-[320px] fixed left-0 top-0 bottom-0 border-r bg-background/95 backdrop-blur z-50">
          <Navigation />
        </aside>
      )}

      {/* Main Content Area */}
      <main 
        ref={mainRef}
        className={cn(
          "flex-1 min-h-screen flex flex-col",
          !isMobile && "md:pl-[280px] lg:pl-[320px]"
        )}
      >
        {/* Main Header */}
        <header className="h-12 border-b bg-background/95 backdrop-blur fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                  <Navigation />
                </SheetContent>
              </Sheet>
            )}
            <h1 className="font-semibold">VICTAURE technologies inc.</h1>
          </div>
          <AppHeader 
            title={title}
            showFriendsList={showFriendsList}
            onToggleFriendsList={onToggleFriendsList}
            isEditing={isEditing}
            onToolReturn={onToolReturn}
          />
        </header>

        {/* Main Content */}
        <div className="flex-1 pt-12 h-[calc(100vh-3rem)]">
          {children}
        </div>

        {/* Friends List Overlay */}
        <AnimatePresence mode="wait">
          {showFriendsList && (
            <DashboardFriendsList 
              show={showFriendsList} 
              onClose={onToggleFriendsList}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

