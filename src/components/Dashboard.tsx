import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuickActions } from "./dashboard/QuickActions";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardChart } from "./dashboard/DashboardChart";
import { RecentActivity } from "./dashboard/RecentActivity";
import type { DashboardStats } from "@/types/dashboard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "./ui/skeleton";

export function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        duration: 0.5
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

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          <motion.div variants={itemVariants}>
            <DashboardHeader 
              title="Tableau de bord"
              description="Bienvenue ! Voici un aperçu de votre activité."
            />
          </motion.div>
        
          <motion.div 
            variants={itemVariants}
            className="mt-8"
          >
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
              </div>
            ) : (
              <QuickActions stats={stats} />
            )}
          </motion.div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Activité récente
              </h3>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <DashboardChart />
              )}
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
            >
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-[300px] w-full" />
                </div>
              ) : (
                <RecentActivity />
              )}
            </motion.div>
          </div>

          <motion.div 
            className="mt-8 flex justify-end"
            variants={itemVariants}
          >
            <Button
              variant="outline"
              className="bg-white dark:bg-gray-800 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
            >
              Voir plus de détails
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}