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
          <div className="responsive-padding h-full overflow-hidden">{component}</div>
        ) : (
          component
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      <div className="relative z-10 flex-1 overflow-auto py-4 sm:py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[2000px]">
          <motion.div 
            className="flex flex-col gap-4 sm:gap-6 max-w-[1200px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Messages Section with Notes, Tasks, and Settings */}
            {renderDashboardSection(
              <Messages />,
              'w-full h-[800px]'
            )}

            {/* SwipeJob Section */}
            {renderDashboardSection(
              <SwipeJob />,
              'w-full h-[600px]',
              false
            )}

            {/* VCard Section */}
            {renderDashboardSection(
              <VCard />,
              'w-full h-[600px]'
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}