import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardContainerProps {
  children: React.ReactNode;
  className?: string;
  viewportHeight: number;
  isEditing?: boolean;
  isMobile?: boolean;
}

export function DashboardContainer({
  children,
  className,
  viewportHeight,
  isEditing,
  isMobile
}: DashboardContainerProps) {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "transform transition-all duration-300 w-full min-h-screen pb-40 lg:pb-24",
              className
            )}
            style={{ 
              maxHeight: isEditing ? viewportHeight : 'none',
              overflowY: isEditing ? 'auto' : 'visible',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: isEditing ? `${viewportHeight * 0.2}px` : '10rem',
              height: isMobile ? `${viewportHeight}px` : 'auto'
            }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}