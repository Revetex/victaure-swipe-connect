import { Briefcase, Calendar, MessageSquare, DollarSign } from "lucide-react";
import { QuickActionCard } from "./QuickActionCard";
import { DashboardStats } from "@/types/dashboard";
import { useMemo } from "react";
import { motion } from "framer-motion";

interface QuickActionsProps {
  stats: DashboardStats | undefined;
}

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

export function QuickActions({ stats }: QuickActionsProps) {
  const quickActions = useMemo(() => [
    {
      title: "Missions en cours",
      value: stats?.activeJobs.toString() || "0",
      icon: Briefcase,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500/20 to-blue-600/20"
    },
    {
      title: "Messages non lus",
      value: stats?.unreadMessages.toString() || "0",
      icon: MessageSquare,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      gradient: "from-green-500/20 to-green-600/20"
    },
    {
      title: "Paiements en attente",
      value: stats?.pendingPayments || "CAD 0",
      icon: DollarSign,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      gradient: "from-yellow-500/20 to-yellow-600/20"
    },
    {
      title: "Prochaine mission",
      value: stats?.nextJob || "Aucune",
      icon: Calendar,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      gradient: "from-purple-500/20 to-purple-600/20"
    },
  ], [stats]);

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {quickActions.map((action, index) => (
        <motion.div key={index} variants={itemVariants}>
          <QuickActionCard {...action} />
        </motion.div>
      ))}
    </motion.div>
  );
}