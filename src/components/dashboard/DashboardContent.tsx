import { motion } from "framer-motion";
import { VCard } from "@/components/VCard";
import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";

interface DashboardContentProps {
  currentPage: number;
  isEditing: boolean;
  containerVariants: any;
  itemVariants: any;
  onEditStateChange: (state: boolean) => void;
  onRequestChat: () => void;
}

export function DashboardContent({
  currentPage,
  isEditing,
  containerVariants,
  itemVariants,
  onEditStateChange,
  onRequestChat,
}: DashboardContentProps) {
  const renderDashboardSection = (
    component: React.ReactNode,
    className: string,
    padding: boolean = true
  ) => (
    <motion.div 
      variants={itemVariants} 
      className={`transform transition-all duration-300 ${className}`}
    >
      <div className="dashboard-card h-full relative">
        {padding ? (
          <div className="p-3 sm:p-4 md:p-6 h-full overflow-y-auto">
            {component}
          </div>
        ) : (
          component
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      className="h-full max-w-[1200px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {currentPage === 1 && (
        <div className={isEditing ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-sm p-4 overflow-auto" : "relative"}>
          {renderDashboardSection(
            <VCard 
              onEditStateChange={onEditStateChange}
              onRequestChat={onRequestChat}
            />,
            'w-full h-full'
          )}
        </div>
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
  );
}