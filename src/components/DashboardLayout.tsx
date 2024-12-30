import { TodoList } from "@/components/TodoList";
import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";
import { PaymentBox } from "@/components/dashboard/PaymentBox";

export function DashboardLayout() {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 min-h-screen bg-background">
      {/* Main Content Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Messages Section */}
        <motion.div 
          className={`${isMobile ? "col-span-1" : "sm:col-span-2 lg:col-span-1"}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card rounded-lg p-4 sm:p-5 h-full transition-transform duration-300 hover:scale-[1.01]">
            <Messages />
          </div>
        </motion.div>

        {/* SwipeJob Section */}
        <motion.div 
          className={`${isMobile ? "col-span-1" : "sm:col-span-2"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SwipeJob />
        </motion.div>

        {/* TodoList Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-lg p-4 sm:p-5 h-full transition-transform duration-300 hover:scale-[1.01]"
        >
          <TodoList />
        </motion.div>

        {/* Payment Box Section */}
        <motion.div 
          className="col-span-1 sm:col-span-2 lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass-card rounded-lg p-4 sm:p-5 h-full transition-transform duration-300 hover:scale-[1.01]">
            <PaymentBox />
          </div>
        </motion.div>

        {/* VCard Section */}
        <motion.div 
          className={`${isMobile ? "col-span-1" : "sm:col-span-2"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <VCard />
        </motion.div>
      </motion.div>
    </div>
  );
}