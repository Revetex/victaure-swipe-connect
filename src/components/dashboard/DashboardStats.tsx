import { Card } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  TrendingUp 
} from "lucide-react";

export function DashboardStats() {
  const { data: stats, isLoading } = useDashboardStats();

  const statCards = [
    {
      title: "Offres d'emploi",
      value: stats?.activeJobs || 0,
      icon: Briefcase,
      color: "from-purple-500/10 to-purple-600/10 dark:from-purple-400/10 dark:to-purple-500/10",
      textColor: "text-purple-700 dark:text-purple-400"
    },
    {
      title: "Connexions",
      value: stats?.unreadMessages || 0,
      icon: Users,
      color: "from-blue-500/10 to-blue-600/10 dark:from-blue-400/10 dark:to-blue-500/10",
      textColor: "text-blue-700 dark:text-blue-400"
    },
    {
      title: "Messages",
      value: stats?.pendingPayments || "0",
      icon: MessageSquare,
      color: "from-emerald-500/10 to-emerald-600/10 dark:from-emerald-400/10 dark:to-emerald-500/10",
      textColor: "text-emerald-700 dark:text-emerald-400"
    }
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50`} />
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <h3 className={`mt-2 text-3xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-full bg-white/10 ${stat.textColor}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
                <span className="text-emerald-500 font-medium">+12%</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">vs last month</span>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </>
  );
}