import { useQueryClient } from "@tanstack/react-query";
import { QuickActions } from "./dashboard/QuickActions";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardChart } from "./dashboard/DashboardChart";
import { RecentActivity } from "./dashboard/RecentActivity";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { motion } from "framer-motion";
import { useState } from "react";
import { MrVictaureWelcome } from "./dashboard/MrVictaureWelcome";
import { AIAssistant } from "./dashboard/AIAssistant";
import { UploadApk } from "./dashboard/UploadApk";
import { JobAnalytics } from "./dashboard/JobAnalytics";
import { JobActions } from "./dashboard/JobActions";

export function Dashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handleStartChat = () => {
    setShowWelcome(false);
    setShowAIAssistant(true);
  };

  const handleDismissWelcome = () => {
    setShowWelcome(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (error) {
    console.error("Erreur du tableau de bord:", error);
    toast.error("Une erreur est survenue lors du chargement des données");
  }

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="py-8 min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      {showWelcome && (
        <MrVictaureWelcome
          onDismiss={handleDismissWelcome}
          onStartChat={handleStartChat}
        />
      )}

      {showAIAssistant && (
        <AIAssistant onClose={() => setShowAIAssistant(false)} />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader 
          title="Tableau de bord"
          description="Bienvenue ! Voici un aperçu de votre activité."
        />
        
        <div className="mt-8">
          <QuickActions stats={stats} />
        </div>

        <div className="mt-8">
          <UploadApk />
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
            <DashboardChart />
          </motion.div>

          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <RecentActivity />
          </motion.div>
        </div>

        <motion.div 
          className="mt-8 flex justify-end gap-4"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
        >
          <JobAnalytics />
          <JobActions />
        </motion.div>
      </div>
    </motion.section>
  );
}