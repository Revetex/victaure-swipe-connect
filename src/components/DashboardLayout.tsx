import { motion } from "framer-motion";
import { Navigation } from "./Navigation";
import { Messages } from "./Messages";
import { SwipeJob } from "./SwipeJob";

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-1 xl:col-span-1 2xl:col-span-1 h-[650px] md:h-[750px]"
          >
            <div className="glass-card rounded-3xl shadow-xl shadow-black/5 dark:shadow-white/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-white/10 hover:-translate-y-1">
              <div className="p-6 sm:p-8 h-full">
                <Messages />
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="col-span-1 md:col-span-1 xl:col-span-1 2xl:col-span-1 h-[650px] md:h-[750px]"
          >
            <div className="glass-card rounded-3xl shadow-xl shadow-black/5 dark:shadow-white/5 h-full transform transition-all duration-300 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-white/10 hover:-translate-y-1">
              <SwipeJob />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}