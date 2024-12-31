import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const handleSwipe = (direction: number) => {
    if (isEditing) return; // Prevent swiping when editing
    let newPage = currentPage + direction;
    if (newPage < 1) newPage = 3;
    if (newPage > 3) newPage = 1;
    setCurrentPage(newPage);
  };

  const renderDashboardSection = (
    component: React.ReactNode,
    className: string,
    padding: boolean = true
  ) => (
    <motion.div 
      variants={itemVariants} 
      className={`transform transition-all duration-300 ${className}`}
    >
      <div className="dashboard-card h-full">
        {padding ? (
          <div className="p-3 sm:p-4 md:p-6 h-full overflow-hidden">{component}</div>
        ) : (
          component
        )}
      </div>
    </motion.div>
  );

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      <div className="relative z-10 flex-1 overflow-hidden">
        {!isEditing && (
          <>
            <div className="absolute top-1/2 left-4 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => handleSwipe(-1)}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>
            <div className="absolute top-1/2 right-4 z-20">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => handleSwipe(1)}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </>
        )}

        <div className="container mx-auto px-4 h-full py-6">
          <motion.div 
            className="h-full max-w-[1200px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {currentPage === 1 && renderDashboardSection(
              <VCard onEditStateChange={setIsEditing} />,
              'w-full h-full'
            )}
            
            {currentPage === 2 && !isEditing && renderDashboardSection(
              <Messages />,
              'w-full h-full'
            )}
            
            {currentPage === 3 && !isEditing && renderDashboardSection(
              <SwipeJob />,
              'w-full h-full',
              false
            )}
          </motion.div>
        </div>

        {!isEditing && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentPage === page 
                    ? 'bg-primary w-6' 
                    : 'bg-primary/50 hover:bg-primary/75'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}