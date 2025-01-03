import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCardRoot } from "@/components/vcard/VCardRoot";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState, useEffect } from "react";
import { DashboardNavigation } from "./dashboard/DashboardNavigation";
import { DashboardContainer } from "./dashboard/DashboardContainer";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState("100vh");

  useEffect(() => {
    const updateHeight = () => {
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

  const handleRequestChat = () => {
    setCurrentPage(2);
  };

  const renderDashboardSection = (
    component: React.ReactNode,
    className: string,
    padding: boolean = true
  ) => (
    <motion.div 
      variants={itemVariants} 
      className={`transform transition-all duration-300 h-full ${className}`}
      style={{ 
        WebkitTransform: "translate3d(0,0,0)",
        WebkitBackfaceVisibility: "hidden",
        WebkitPerspective: "1000",
      }}
    >
      <div className="dashboard-card h-full flex flex-col">
        {padding ? (
          <div className="p-3 sm:p-4 md:p-6 flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
            {component}
          </div>
        ) : (
          component
        )}
      </div>
    </motion.div>
  );

  const renderCurrentPage = () => {
    if (currentPage === 1) {
      return (
        <div 
          className={`${isEditing ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 pb-0" : "relative h-full"} overflow-auto -webkit-overflow-scrolling-touch`}
          style={{ height: isEditing ? viewportHeight : "100%" }}
        >
          {renderDashboardSection(
            <VCardRoot 
              onEditStateChange={setIsEditing}
              onRequestChat={handleRequestChat}
            />,
            'w-full h-full'
          )}
        </div>
      );
    }

    if (currentPage === 2 && !isEditing) {
      return renderDashboardSection(
        <Messages />,
        'w-full h-full'
      );
    }

    if (currentPage === 3 && !isEditing) {
      return renderDashboardSection(
        <SwipeJob />,
        'w-full h-full',
        false
      );
    }

    return null;
  };

  return (
    <DashboardContainer containerVariants={containerVariants}>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <AnimatePresence mode="sync">
            {renderCurrentPage()}
          </AnimatePresence>
        </div>
        
        {!isEditing && (
          <nav 
            className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 py-2 z-50"
            style={{ 
              paddingBottom: `max(0.5rem, env(safe-area-inset-bottom))`,
            }}
          >
            <div className="container mx-auto px-4">
              <DashboardNavigation 
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </nav>
        )}
      </div>
    </DashboardContainer>
  );
}