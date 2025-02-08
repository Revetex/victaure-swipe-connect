
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
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      {!isMobile && (
        <aside className="w-[280px] lg:w-[320px] fixed left-0 top-0 bottom-0 border-r bg-background/95 backdrop-blur z-50">
          <Navigation />
        </aside>
      )}

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 min-h-screen flex flex-col",
        !isMobile && "md:pl-[280px] lg:pl-[320px]"
      )}>
        {/* Header */}
        <header className="h-16 border-b bg-background/95 backdrop-blur sticky top-0 z-40">
          <div className="container h-full mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
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
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1">
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
          >
            <div className="container mx-auto px-4 h-full">
              {/* Navigation content */}
            </div>
          </nav>
        )}
      </main>
    </div>
  );
}
