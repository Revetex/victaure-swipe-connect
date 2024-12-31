import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useDashboardAnimations } from "@/hooks/useDashboardAnimations";
import { Skeleton } from "./ui/skeleton";
import { Suspense } from "react";

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
      className={`transform transition-all duration-300 backdrop-blur-sm ${className}`}
    >
      <div className="dashboard-card h-full bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        {padding ? (
          <div className="p-3 sm:p-4 md:p-6 h-full overflow-hidden">
            <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
              {component}
            </Suspense>
          </div>
        ) : (
          <Suspense fallback={<Skeleton className="h-full w-full rounded-lg" />}>
            {component}
          </Suspense>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      <div className="relative z-10 flex-1 overflow-auto py-2 sm:py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 max-w-[2000px]">
          <motion.div 
            className="flex flex-col gap-6 sm:gap-8 md:gap-12 max-w-[1200px] mx-auto pb-24 sm:pb-32 md:pb-40"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
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