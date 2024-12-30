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
    <div className="relative min-h-screen overflow-hidden">
      {/* Blurred background */}
      <div 
        className="fixed inset-0 bg-cyber-pattern bg-cover bg-center bg-no-repeat"
        style={{ filter: 'blur(8px)', transform: 'scale(1.1)' }}
      />
      
      {/* Content overlay */}
      <div className="relative container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="max-w-[2000px] mx-auto">
          {/* Main Content Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Messages Section - Full width on mobile, normal on desktop */}
            <motion.div 
              className="col-span-1 md:col-span-1 xl:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass-card h-full p-4 sm:p-5">
                <Messages />
              </div>
            </motion.div>

            {/* SwipeJob Section - Larger area */}
            <motion.div 
              className="col-span-1 md:col-span-1 xl:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="glass-card h-full">
                <SwipeJob />
              </div>
            </motion.div>

            {/* TodoList Section */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="col-span-1"
            >
              <div className="glass-card h-full p-4 sm:p-5">
                <TodoList />
              </div>
            </motion.div>

            {/* Payment Box Section - Wide section */}
            <motion.div 
              className="col-span-1 md:col-span-2 xl:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="glass-card h-full p-4 sm:p-5">
                <PaymentBox />
              </div>
            </motion.div>

            {/* VCard Section */}
            <motion.div 
              className="col-span-1 md:col-span-2 xl:col-span-1 2xl:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="glass-card h-full">
                <VCard />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}