import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function JobAnalytics() {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const analyzeJobContent = async (text: string) => {
    try {
      // For now, we'll use a simple relevancy check
      // This will be replaced with AI analysis in a future update
      const isRelevant = !text.toLowerCase().includes("spam") && 
                        !text.toLowerCase().includes("scam") &&
                        text.length > 20;
      
      return isRelevant;
    } catch (error) {
      console.error("Erreur lors de l'analyse du contenu:", error);
      return true; // Keep job by default in case of error
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

  return (
    <Button
      variant="outline"
      onClick={cleanupJobs}
      disabled={isProcessing}
      className="bg-white dark:bg-gray-800 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 transition-all duration-300"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Nettoyage...
        </>
      ) : (
        'Nettoyer les emplois'
      )}
    </Button>
  );
}