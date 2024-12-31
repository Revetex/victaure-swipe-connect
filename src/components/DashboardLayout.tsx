import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";

export function DashboardLayout() {
  const isMobile = useIsMobile();
  const { containerVariants, itemVariants } = useDashboardAnimations();

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

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      <div className="relative z-10 flex-1 overflow-auto py-2 sm:py-4">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 max-w-[2000px]">
          <motion.div 
            className="flex flex-col gap-2 sm:gap-3 md:gap-4 max-w-[1200px] mx-auto pb-24 sm:pb-32 md:pb-40"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* VCard Section */}
            {renderDashboardSection(
              <VCard />,
              'w-full h-[600px] sm:h-[650px] md:h-[700px]'
            )}

            {/* Messages Section with Notes, Tasks, and Settings */}
            {renderDashboardSection(
              <Messages />,
              'w-full h-[600px] sm:h-[700px] md:h-[800px]'
            )}

            {/* SwipeJob Section */}
            {renderDashboardSection(
              <SwipeJob />,
              'w-full h-[500px] sm:h-[550px] md:h-[600px]',
              false
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}