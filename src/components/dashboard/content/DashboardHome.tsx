
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
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-8 space-y-10 max-w-7xl"
    >
      <div className="flex flex-col lg:flex-row gap-10">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="lg:w-2/3 bg-white/5 rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative p-8"
        >
          <DashboardStats />
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:w-1/3 bg-white/5 rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative p-6"
        >
          <DashboardChart />
        </motion.div>
      </div>
      
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 rounded-3xl shadow-2xl border border-white/10 p-6"
        >
          <QuickActions onRequestChat={onRequestChat} />
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-3xl shadow-2xl border border-white/10 p-6"
        >
          <RecentActivity />
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2 lg:col-span-1 bg-white/5 rounded-3xl shadow-2xl border border-white/10 p-6"
        >
          <JobActions />
        </motion.div>
      </div>
    </motion.div>
  );
}
