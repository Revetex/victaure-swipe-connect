
import { motion } from "framer-motion";
import { MrVictaureWelcome } from "../MrVictaureWelcome";
import { DashboardStats } from "../DashboardStats";
import { QuickActions } from "../QuickActions";
import { RecentActivity } from "../RecentActivity";
import { DashboardChart } from "../DashboardChart";

interface DashboardHomeProps {
  onRequestChat: () => void;
}

export function DashboardHome({ onRequestChat }: DashboardHomeProps) {
  return (
    <div className="space-y-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MrVictaureWelcome 
          onDismiss={() => {}} 
          onStartChat={onRequestChat}
        />
      </motion.div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="col-span-full lg:col-span-2"
        >
          <DashboardStats />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="glass-card h-full"
        >
          <QuickActions onRequestChat={onRequestChat} />
        </motion.div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="glass-card"
        >
          <DashboardChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="glass-card"
        >
          <RecentActivity />
        </motion.div>
      </div>
    </div>
  );
}
