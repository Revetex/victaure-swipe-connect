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
        staggerChildren: 0.1
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
    <div className="relative min-h-screen overflow-hidden bg-background/50">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-nature-pattern bg-cover bg-center bg-no-repeat"
      />
      
      {/* Content overlay */}
      <div className="relative container mx-auto px-4 py-6 sm:py-8">
        <motion.div 
          className="max-w-[2000px] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Messages Section */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-1 xl:col-span-1"
          >
            <div className="glass-card h-full p-5 rounded-xl shadow-lg backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20">
              <Messages />
            </div>
          </motion.div>

          {/* SwipeJob Section */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-1 xl:col-span-2"
          >
            <div className="glass-card h-full rounded-xl shadow-lg backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20">
              <SwipeJob />
            </div>
          </motion.div>

          {/* TodoList Section */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1"
          >
            <div className="glass-card h-full p-5 rounded-xl shadow-lg backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20">
              <TodoList />
            </div>
          </motion.div>

          {/* Payment Box Section */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-2 xl:col-span-2"
          >
            <div className="glass-card h-full p-5 rounded-xl shadow-lg backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20">
              <PaymentBox />
            </div>
          </motion.div>

          {/* VCard Section */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-2 xl:col-span-1 2xl:col-span-2"
          >
            <div className="glass-card h-full rounded-xl shadow-lg backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 border border-white/20 dark:border-gray-800/20">
              <VCard />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}