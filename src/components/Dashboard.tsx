import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuickActions } from "./dashboard/QuickActions";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardChart } from "./dashboard/DashboardChart";
import { RecentActivity } from "./dashboard/RecentActivity";
import type { DashboardStats } from "@/types/dashboard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { MrVictaureWelcome } from "./dashboard/MrVictaureWelcome";
import { useState } from "react";
import { AIAssistant } from "./dashboard/AIAssistant";
import { UploadApk } from "./dashboard/UploadApk";
import { pipeline } from "@huggingface/transformers";

export function Dashboard() {
  const queryClient = useQueryClient();
  const { data: stats, isLoading, error } = useDashboardStats();
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleError = (error: Error) => {
    console.error("Erreur du tableau de bord:", error);
    toast.error("Une erreur est survenue lors du chargement des données");
  };

  const handleExport = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");

      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id);

      if (jobsError) throw jobsError;

      const csvContent = "data:text/csv;charset=utf-8," + 
        "Titre,Description,Budget,Statut,Date de création\n" +
        jobsData.map(job => 
          `${job.title},${job.description},${job.budget},${job.status},${job.created_at}`
        ).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "missions.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export réussi !");
    } catch (error) {
      handleError(error as Error);
    }
  };

  const analyzeJobContent = async (text: string) => {
    try {
      const classifier = await pipeline(
        'text-classification',
        'facebook/bart-large-mnli',
        { device: 'cpu' }
      );
      
      const result = await classifier(text, {
        candidate_labels: ['pertinent', 'non pertinent', 'spam', 'obsolète']
      });
      
      console.log("Analyse du contenu:", result);
      return result.labels[0] === 'pertinent';
    } catch (error) {
      console.error("Erreur lors de l'analyse du contenu:", error);
      return true; // En cas d'erreur, on garde l'emploi par défaut
    }
  };

  const cleanupJobs = async () => {
    try {
      setIsProcessing(true);
      console.log("Début du nettoyage intelligent des emplois...");

      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*');

      if (jobsError) throw jobsError;

      console.log(`Analyse de ${jobs?.length || 0} emplois...`);

      for (const job of jobs || []) {
        const shouldKeep = await analyzeJobContent(`${job.title} ${job.description}`);
        
        if (!shouldKeep) {
          console.log(`Suppression de l'emploi: ${job.title}`);
          const { error: deleteError } = await supabase
            .from('jobs')
            .delete()
            .eq('id', job.id);

          if (deleteError) {
            console.error(`Erreur lors de la suppression de l'emploi ${job.id}:`, deleteError);
          }
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['jobs'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      toast.success("Nettoyage des emplois terminé !");
    } catch (error) {
      console.error("Erreur lors du nettoyage des emplois:", error);
      toast.error("Une erreur est survenue lors du nettoyage des emplois");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefresh = async () => {
    try {
      console.log("Refreshing dashboard data...");
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      await queryClient.invalidateQueries({ queryKey: ['jobs'] });
      await queryClient.invalidateQueries({ queryKey: ['scraped-jobs'] });
      toast.success("Données actualisées !");
    } catch (error) {
      handleError(error as Error);
    }
  };

  const handleCreateJob = () => {
    navigate("/jobs/create");
  };

  const handleStartChat = () => {
    setShowWelcome(false);
    setShowAIAssistant(true);
  };

  const handleDismissWelcome = () => {
    setShowWelcome(false);
  };

  if (error) {
    handleError(error as Error);
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
          <Button
            variant="outline"
            onClick={cleanupJobs}
            disabled={isProcessing}
            className="bg-white dark:bg-gray-800 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            {isProcessing ? 'Nettoyage...' : 'Nettoyer les emplois'}
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="bg-white dark:bg-gray-800 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            Actualiser
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            className="bg-white dark:bg-gray-800 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            Exporter
          </Button>
          <Button
            onClick={handleCreateJob}
            className="bg-victaure-blue text-white hover:bg-victaure-blue/90 transition-all duration-300"
          >
            Créer une mission
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}