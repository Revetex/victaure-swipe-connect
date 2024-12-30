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
    <div className="min-h-screen bg-dashboard-pattern bg-cover bg-center bg-fixed">
      {/* Semi-transparent gradient overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50 backdrop-blur-[2px]" />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Messages Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1"
            >
              <div className="glass-card rounded-xl shadow-xl shadow-black/5 h-full">
                <div className="p-4 sm:p-6">
                  <Messages />
                </div>
              </div>
            </motion.div>

            {/* SwipeJob Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-1 xl:col-span-2"
            >
              <div className="glass-card rounded-xl shadow-xl shadow-black/5 h-full">
                <SwipeJob />
              </div>
            </motion.div>

            {/* TodoList Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1"
            >
              <div className="glass-card rounded-xl shadow-xl shadow-black/5 h-full">
                <div className="p-4 sm:p-6">
                  <TodoList />
                </div>
              </div>
            </motion.div>

            {/* Payment Box Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-2 xl:col-span-2"
            >
              <div className="glass-card rounded-xl shadow-xl shadow-black/5 h-full">
                <div className="p-4 sm:p-6">
                  <PaymentBox />
                </div>
              </div>
            </motion.div>

            {/* VCard Section */}
            <motion.div 
              variants={itemVariants}
              className="col-span-1 md:col-span-2 xl:col-span-1 2xl:col-span-2"
            >
              <div className="glass-card rounded-xl shadow-xl shadow-black/5 h-full">
                <div className="p-4 sm:p-6">
                  <VCard />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}