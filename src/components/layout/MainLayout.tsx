
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
        <aside className="w-[280px] lg:w-[320px] fixed left-0 top-0 bottom-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
          <Navigation />
        </aside>
      )}

      {/* Main Content Area */}
      <main className={cn(
        "flex-1 min-h-screen flex flex-col relative",
        !isMobile && "md:pl-[280px] lg:pl-[320px]"
      )}>
        {/* Header */}
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-40">
          <div className={cn(
            "h-full px-4 flex items-center justify-between",
            !isMobile && "md:pl-[280px] lg:pl-[320px]"
          )}>
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
        <div className="flex-1 pt-24 px-4 pb-24 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
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
              "h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed bottom-0 left-0 right-0 z-40",
              !isMobile && "md:ml-[280px] lg:ml-[320px]"
            )}
            style={{ 
              paddingBottom: 'env(safe-area-inset-bottom)'
            }}
          >
            <div className="h-full px-4">
              {/* Navigation content */}
            </div>
          </nav>
        )}
      </main>
    </div>
  );
}

