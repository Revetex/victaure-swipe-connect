import { motion } from "framer-motion";
import { DashboardStats } from "./DashboardStats";
import { DashboardChart } from "./DashboardChart";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { ScrapedJobs } from "./ScrapedJobs";
import { AIAssistant } from "./AIAssistant";

export function DashboardContent() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-charcoal dark:to-dark-purple">
      <div className="container px-4 py-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          <DashboardStats />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-full lg:col-span-2"
          >
            <div className="p-6 bg-white dark:bg-dark-charcoal rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Activité
              </h2>
              <DashboardChart />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <QuickActions />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-full lg:col-span-2"
          >
            <ScrapedJobs />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <RecentActivity />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="col-span-full"
          >
            <AIAssistant />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}