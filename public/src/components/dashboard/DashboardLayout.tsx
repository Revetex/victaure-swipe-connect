import { useState, useEffect } from "react";
import { DashboardContent } from "./DashboardContent";
import { DashboardNavigation } from "./DashboardNavigation";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const THROTTLE_DELAY = 300; // ms

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPageChange, setLastPageChange] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePageChange = (page: number) => {
    const now = Date.now();
    if (now - lastPageChange >= THROTTLE_DELAY) {
      setCurrentPage(page);
      setLastPageChange(now);
      if (page !== 4) {
        setIsEditing(false);
      }
    }
  };

  const handleEditStateChange = (editing: boolean) => {
    setIsEditing(editing);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div className="container mx-auto px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              variants={itemVariants} 
              className="transform transition-all duration-300 w-full"
              style={{ 
                maxHeight: isEditing ? viewportHeight : 'none',
                overflowY: isEditing ? 'auto' : 'visible',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: isEditing ? `${viewportHeight * 0.2}px` : '1rem'
              }}
            >
              <DashboardContent
                currentPage={currentPage}
                viewportHeight={viewportHeight}
                onEditStateChange={handleEditStateChange}
                onRequestChat={() => {}}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <nav 
        className={`fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border/50 z-50 transition-all duration-300 ${
          isEditing && currentPage === 4 ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      >
        <div className="container mx-auto px-4 py-2">
          <DashboardNavigation 
            currentPage={currentPage} 
            onPageChange={handlePageChange}
          />
        </div>
      </nav>
    </div>
  );
}