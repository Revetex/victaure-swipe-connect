import { motion } from "framer-motion";
import { DashboardStats } from "../DashboardStats";
import { QuickActions } from "../QuickActions";
import { RecentActivity } from "../RecentActivity";
import { JobActions } from "../JobActions";
import { DashboardChart } from "../DashboardChart";
interface DashboardHomeProps {
  onRequestChat: () => void;
}
export function DashboardHome({
  onRequestChat
}: DashboardHomeProps) {
  const containerVariants = {
    initial: {
      opacity: 0
    },
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
    initial: {
      y: 20,
      opacity: 0
    },
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
  return <motion.div variants={containerVariants} initial="initial" animate="animate" exit="exit" className="container mx-auto p-8 space-y-10 max-w-7xl">
      
      
      
    </motion.div>;
}