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
          <div className="p-4 sm:p-6 lg:p-8 h-full">{component}</div>
        ) : (
          component
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      <div className="relative z-10 flex-1 overflow-auto py-4 sm:py-6 lg:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px] pb-6 sm:pb-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
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
              "col-span-1 md:col-span-1 xl:col-span-2 h-[700px] sm:h-[800px] lg:h-[900px]",
              false
            )}

            {/* VCard Section */}
            {renderDashboardSection(
              <VCard />,
              "col-span-1 md:col-span-2 xl:col-span-4 min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]"
            )}

            {/* PaymentBox Section */}
            {renderDashboardSection(
              <PaymentBox />,
              "col-span-1 md:col-span-2 xl:col-span-4 h-[400px] sm:h-[450px] lg:h-[500px]"
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}