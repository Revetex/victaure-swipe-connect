import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCardRoot } from "@/components/vcard/VCardRoot";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useEffect } from "react";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { DashboardContainer } from "./dashboard/DashboardContainer";
import { Settings } from "@/components/Settings";
import { TodoSection } from "@/components/todo/TodoSection";
import { NotesSection } from "@/components/todo/NotesSection";
import { PaymentBox } from "./dashboard/PaymentBox";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100vh");

  // Handle viewport height for mobile browsers
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setViewportHeight(`${window.innerHeight}px`);
    };
    
    updateHeight();
    window.addEventListener("resize", updateHeight);
    window.visualViewport?.addEventListener("resize", updateHeight);
    
    return () => {
      window.removeEventListener("resize", updateHeight);
      window.visualViewport?.removeEventListener("resize", updateHeight);
    };
  }, []);

  const renderDashboardSection = (
    component: React.ReactNode,
    className: string,
    padding: boolean = true
  ) => (
    <motion.div 
      variants={itemVariants} 
      className={`transform-gpu will-change-transform ${className}`}
      style={{ 
        height: isEditing ? viewportHeight : '100%',
        WebkitTransform: 'translate3d(0,0,0)',
        WebkitBackfaceVisibility: 'hidden',
        WebkitPerspective: '1000'
      }}
    >
      <div className="dashboard-card h-full flex flex-col bg-background/80 backdrop-blur-sm rounded-lg shadow-lg">
        {padding ? (
          <div className="p-3 sm:p-4 md:p-6 flex-1 overflow-y-auto overscroll-contain">
            {component}
          </div>
        ) : (
          component
        )}
      </div>
    </motion.div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return renderDashboardSection(
          <Messages />,
          'w-full h-full'
        );
      case 2:
        return renderDashboardSection(
          <TodoSection />,
          'w-full h-full'
        );
      case 3:
        return renderDashboardSection(
          <NotesSection />,
          'w-full h-full'
        );
      case 4:
        return renderDashboardSection(
          <PaymentBox />,
          'w-full h-full'
        );
      case 5:
        return renderDashboardSection(
          <Settings />,
          'w-full h-full'
        );
      default:
        return null;
    }
  };

  return (
    <DashboardContainer containerVariants={containerVariants}>
      <div 
        className="flex flex-col min-h-[100vh] min-h-[100dvh] w-full"
        style={{ minHeight: `calc(var(--vh, 1vh) * 100)` }}
      >
        <div className="flex-1 flex flex-col relative">
          <AnimatePresence mode="sync">
            {renderCurrentPage()}
          </AnimatePresence>
        </div>
        
        {!isEditing && (
          <nav 
            className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 py-2 z-50 safe-area-bottom"
            style={{ 
              paddingBottom: `max(0.5rem, env(safe-area-inset-bottom))`,
            }}
          >
            <DashboardNavigation 
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </nav>
        )}
      </div>
    </DashboardContainer>
  );
}