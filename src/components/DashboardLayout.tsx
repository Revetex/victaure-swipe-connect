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
      <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
        {padding ? (
          <div className="p-3 sm:p-4 lg:p-6 h-full">{component}</div>
        ) : (
          component
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      <div className="relative z-10 flex-1 overflow-auto py-2 sm:py-4 lg:py-6">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 max-w-[1920px] pb-4 sm:pb-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Messages Section with Notes and Tasks */}
            {renderDashboardSection(
              <Messages />,
              "col-span-1 xl:col-span-2 h-[700px] sm:h-[800px] lg:h-[900px]"
            )}

            {/* SwipeJob Section */}
            {renderDashboardSection(
              <SwipeJob />,
              "col-span-1 md:col-span-1 xl:col-span-2 h-[500px] sm:h-[600px] lg:h-[700px]",
              false
            )}

            {/* VCard Section */}
            {renderDashboardSection(
              <VCard />,
              "col-span-1 md:col-span-2 xl:col-span-4 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] mb-4 sm:mb-6"
            )}

            {/* PaymentBox Section */}
            {renderDashboardSection(
              <PaymentBox />,
              "col-span-1 md:col-span-2 xl:col-span-4 h-[300px] sm:h-[350px] lg:h-[400px]"
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}