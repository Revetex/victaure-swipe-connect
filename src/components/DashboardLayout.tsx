import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";
import { PaymentBox } from "@/components/dashboard/PaymentBox";
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px]">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Messages Section with Notes and Tasks */}
            {renderDashboardSection(
              <Messages />,
              "col-span-1 xl:col-span-2 h-[600px]"
            )}

            {/* SwipeJob Section */}
            {renderDashboardSection(
              <SwipeJob />,
              "col-span-1 xl:col-span-1 h-[600px]",
              false
            )}

            {/* VCard Section */}
            {renderDashboardSection(
              <VCard />,
              "col-span-1 md:col-span-2 xl:col-span-2 h-[500px]"
            )}

            {/* PaymentBox Section */}
            {renderDashboardSection(
              <PaymentBox />,
              "col-span-1 md:col-span-2 xl:col-span-2 h-[400px]"
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}