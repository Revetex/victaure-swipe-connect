import { TodoList } from "@/components/TodoList";
import { Messages } from "@/components/Messages";
import { SwipeJob } from "@/components/SwipeJob";
import { useIsMobile } from "@/hooks/use-mobile";
import { VCard } from "@/components/VCard";
import { motion } from "framer-motion";

export function DashboardLayout() {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 min-h-screen bg-background">
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Messages Section - Left Column */}
        <motion.div 
          className="lg:col-span-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass-card rounded-lg p-4 sm:p-5 h-full transition-transform duration-300 hover:scale-[1.01]">
            <Messages />
          </div>
        </motion.div>

        {/* Main Content - Center Column */}
        <motion.div 
          className="lg:col-span-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* SwipeJob Section */}
          <SwipeJob />

          {/* VCard Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <VCard />
          </motion.div>
        </motion.div>

        {/* TodoList Section - Right Column */}
        <motion.div 
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="glass-card rounded-lg p-4 sm:p-5 h-full transition-transform duration-300 hover:scale-[1.01]">
            <TodoList />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}