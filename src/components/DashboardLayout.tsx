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

  return (
    <div className="fixed inset-0 flex flex-col bg-dashboard-pattern bg-cover bg-center bg-fixed">
      {/* Content */}
      <div className="relative z-10 flex-1 overflow-auto py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1920px]">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8 md:gap-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Messages Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 h-[650px] md:h-[750px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                <div className="p-6 sm:p-8 h-full">
                  <Messages />
                </div>
              </div>
            </motion.div>

            {/* SwipeJob Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-1 xl:col-span-2 h-[650px] md:h-[750px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                <SwipeJob />
              </div>
            </motion.div>

            {/* TodoList Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 h-[650px] md:h-[750px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                <div className="p-6 sm:p-8 h-full">
                  <TodoList />
                </div>
              </div>
            </motion.div>

            {/* VCard Section - Moved and resized */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-2 xl:col-span-4 h-[650px] md:h-[750px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                <div className="p-6 sm:p-8 h-full">
                  <VCard />
                </div>
              </div>
            </motion.div>

            {/* Payment Box Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-2 xl:col-span-4 h-[450px]"
            >
              <div className="glass-card rounded-3xl shadow-xl shadow-black/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1">
                <div className="p-6 sm:p-8 h-full">
                  <PaymentBox />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}