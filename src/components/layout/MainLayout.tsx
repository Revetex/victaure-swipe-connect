
import { ReactNode } from "react";
import { DashboardFriendsList } from "@/components/dashboard/DashboardFriendsList";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ErrorBoundary } from "react-error-boundary";
import { LayoutErrorBoundary } from "./LayoutErrorBoundary";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, ArrowUp, ArrowDown } from "lucide-react";
import { useState } from "react";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  isEditing?: boolean;
  showFriendsList?: boolean;
  onToggleFriendsList?: () => void;
  onToolReturn?: () => void;
}

const layoutVariants = {
  initial: { opacity: 0, y: 20 },
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
    transition: { duration: 0.2 }
  }
};

export function MainLayout({ 
  children, 
  isEditing = false,
  showFriendsList = false,
  onToggleFriendsList = () => {},
}: MainLayoutProps) {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <ErrorBoundary
      FallbackComponent={LayoutErrorBoundary}
      onError={(error) => {
        console.error('Layout Error:', error);
      }}
      onReset={() => window.location.reload()}
    >
      <div className="flex min-h-screen bg-background flex-col">
        {/* Header with Navigation */}
        <header className="h-16 border-b bg-background flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="p-0">
              <nav className="flex flex-col p-4 space-y-4">
                <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}>
                  <ArrowUp className="h-5 w-5 mr-2" />
                  Haut
                </Button>
                <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}>
                  <ArrowDown className="h-5 w-5 mr-2" />
                  Bas
                </Button>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-4">
            {!isEditing && (
              <Button
                variant="outline"
                onClick={onToggleFriendsList}
                className={cn(
                  "hidden md:flex items-center gap-2",
                  showFriendsList && "bg-primary/5 text-primary"
                )}
              >
                <Menu className="h-4 w-4" />
                <span>Amis</span>
              </Button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <motion.div 
          className={cn(
            "flex-1 flex flex-col min-h-screen relative mt-16",
            !isMobile && "md:pl-[280px] lg:pl-[320px]"
          )}
          variants={layoutVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <main className="flex-1">
            {children}
          </main>

          {showFriendsList && (
            <DashboardFriendsList 
              show={showFriendsList} 
              onClose={onToggleFriendsList}
            />
          )}
        </motion.div>

        {/* Footer with Navigation */}
        <footer className="h-16 border-t bg-background flex items-center justify-between px-4 fixed bottom-0 left-0 right-0 z-50">
          <nav className="flex items-center justify-around w-full">
            <Button variant="ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <ArrowUp className="h-5 w-5" />
            </Button>
            <Button variant="ghost" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
              <ArrowDown className="h-5 w-5" />
            </Button>
          </nav>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
