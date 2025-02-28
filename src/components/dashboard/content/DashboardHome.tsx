
import { motion } from "framer-motion";
import { MrVictaureWelcome } from "../MrVictaureWelcome";
import { DashboardStats } from "../DashboardStats";
import { QuickActions } from "../QuickActions";
import { RecentActivity } from "../RecentActivity";
import { DashboardChart } from "../DashboardChart";

export function DashboardHome({ onRequestChat }: { onRequestChat?: () => void }) {
  return (
    <div className="space-y-8 relative pb-10">
      {/* Background effect */}
      <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <MrVictaureWelcome onRequestChat={onRequestChat} />
      </motion.div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="col-span-full lg:col-span-2"
        >
          <DashboardStats />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="h-full"
        >
          <QuickActions onRequestChat={onRequestChat} />
        </motion.div>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="bg-gradient-to-br from-[#1A1F2C]/90 to-[#1B2A4A]/80 backdrop-blur-md border border-white/5 rounded-2xl shadow-lg overflow-hidden"
        >
          <DashboardChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="bg-gradient-to-br from-[#1A1F2C]/90 to-[#1B2A4A]/80 backdrop-blur-md border border-white/5 rounded-2xl shadow-lg overflow-hidden"
        >
          <RecentActivity />
        </motion.div>
      </div>
    </div>
  );
}
