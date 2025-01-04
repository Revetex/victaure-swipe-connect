import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
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
import { useState } from "react";

export function Dashboard() {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    data: stats, 
    isLoading, 
    error,
    refetch 
  } = useDashboardStats();

  // Enhanced error handling with specific error messages
  const handleError = (error: Error, context: string) => {
    console.error(`Error in ${context}:`, error);
    
    const errorMessage = error.message || "Une erreur inattendue est survenue";
    toast.error(errorMessage, {
      description: `Erreur lors de ${context}`,
      duration: 5000,
    });
  };

  // Enhanced export function with proper error handling and loading state
  const handleExport = async () => {
    if (isExporting) return;
    
    try {
      setIsExporting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Vous devez être connecté pour exporter les données");
      }

      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id);

      if (jobsError) throw jobsError;

      if (!jobsData?.length) {
        toast.info("Aucune donnée à exporter");
        return;
      }

      // Format data for CSV
      const headers = [
        "Titre",
        "Description",
        "Budget",
        "Statut",
        "Date de création",
        "Type de contrat",
        "Niveau d'expérience",
        "Localisation"
      ];

      const rows = jobsData.map(job => [
        job.title,
        job.description,
        job.budget,
        job.status,
        new Date(job.created_at).toLocaleDateString('fr-FR'),
        job.contract_type,
        job.experience_level,
        job.location
      ]);

      // Create CSV content with proper escaping
      const csvContent = "data:text/csv;charset=utf-8," + 
        headers.join(",") + "\n" +
        rows.map(row => 
          row.map(cell => 
            typeof cell === 'string' ? 
              `"${cell.replace(/"/g, '""')}"` : 
              cell
          ).join(",")
        ).join("\n");

      // Download file
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `missions_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Export réussi !");
    } catch (error) {
      handleError(error as Error, "l'export des données");
    } finally {
      setIsExporting(false);
    }
  };

  // Enhanced refresh function with loading state and optimistic updates
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      await refetch();
      toast.success("Données actualisées avec succès !");
    } catch (error) {
      handleError(error as Error, "l'actualisation des données");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Enhanced navigation with state persistence
  const handleCreateJob = () => {
    try {
      navigate("/jobs/create", { 
        state: { 
          returnPath: "/dashboard",
          timestamp: Date.now() 
        } 
      });
    } catch (error) {
      handleError(error as Error, "la navigation");
    }
  };

  // Handle initial error
  if (error) {
    handleError(error as Error, "le chargement initial");
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader 
          title="Tableau de bord"
          description="Bienvenue ! Voici un aperçu de votre activité."
        />
        
        <div className="mt-8">
          <QuickActions stats={stats} isLoading={isLoading} />
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
          className="mt-8 flex flex-wrap justify-end gap-4"
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0 }
          }}
        >
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white dark:bg-gray-800 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            {isRefreshing ? "Actualisation..." : "Actualiser"}
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="bg-white dark:bg-gray-800 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            {isExporting ? "Export en cours..." : "Exporter"}
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