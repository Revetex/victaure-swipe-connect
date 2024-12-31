import { TodoList } from "@/components/TodoList";
import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";
import { PaymentBox } from "@/components/dashboard/PaymentBox";

export function DashboardLayout() {
  const isMobile = useIsMobile();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const renderDashboardSection = (
    component: React.ReactNode,
    className: string,
    padding: boolean = true
  ) => (
    <motion.div variants={itemVariants} className={className}>
      <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
        {padding ? (
          <div className="p-6 sm:p-8 h-full">{component}</div>
        ) : (
          component
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      <div className="relative z-10 flex-1 overflow-auto py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px] pb-12">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 md:gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {renderDashboardSection(
              <Messages />,
              "col-span-1 h-[650px] md:h-[750px]"
            )}

            {renderDashboardSection(
              <SwipeJob />,
              "col-span-1 md:col-span-1 xl:col-span-2 h-[650px] md:h-[750px]",
              false
            )}

            {renderDashboardSection(
              <TodoList />,
              "col-span-1 h-[650px] md:h-[750px]"
            )}

            {renderDashboardSection(
              <VCard />,
              "col-span-1 md:col-span-2 xl:col-span-4 min-h-[650px] md:min-h-[750px] mb-12"
            )}

            {renderDashboardSection(
              <PaymentBox />,
              "col-span-1 md:col-span-2 xl:col-span-4 h-[450px]"
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}