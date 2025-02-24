
import { motion } from "framer-motion";
import { DashboardStats } from "../DashboardStats";
import { QuickActions } from "../QuickActions";
import { RecentActivity } from "../RecentActivity";
import { JobActions } from "../JobActions";
import { DashboardChart } from "../DashboardChart";

interface DashboardHomeProps {
  onRequestChat: () => void;
}

export function DashboardHome({ onRequestChat }: DashboardHomeProps) {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto p-8 space-y-10 max-w-7xl"
    >
      <div className="flex flex-col lg:flex-row gap-10">
        <motion.div 
          variants={itemVariants}
          className="lg:w-2/3 glass-panel rounded-3xl shadow-2xl border border-primary/10 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative p-8">
            <DashboardStats />
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="lg:w-1/3 glass-panel rounded-3xl shadow-2xl border border-primary/10 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 to-transparent pointer-events-none" />
          <div className="relative p-6">
            <DashboardChart />
          </div>
        </motion.div>
      </div>
      
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <motion.div 
          variants={itemVariants}
          className="glass-panel rounded-3xl shadow-2xl border border-primary/10 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <QuickActions onRequestChat={onRequestChat} />
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="glass-panel rounded-3xl shadow-2xl border border-primary/10 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <RecentActivity />
          </div>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="md:col-span-2 lg:col-span-1 glass-panel rounded-3xl shadow-2xl border border-primary/10 overflow-hidden relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -right-16 -bottom-16 w-32 h-32 bg-green-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6">
            <JobActions />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
