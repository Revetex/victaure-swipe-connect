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
      color: "text-victaure-blue",
      bgColor: "bg-victaure-blue/10",
    },
    {
      title: "Messages non lus",
      value: stats?.unreadMessages.toString() || "0",
      icon: MessageSquare,
      color: "text-victaure-green",
      bgColor: "bg-victaure-green/10",
    },
    {
      title: "Paiements en attente",
      value: stats?.pendingPayments || "CAD 0",
      icon: DollarSign,
      color: "text-victaure-red",
      bgColor: "bg-victaure-red/10",
    },
    {
      title: "Prochaine mission",
      value: stats?.nextJob || "Aucune",
      icon: Calendar,
      color: "text-victaure-blue",
      bgColor: "bg-victaure-blue/10",
    },
  ], [stats]);

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
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