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
      const { data, error } = await supabase.functions.invoke('analyze-job-content', {
        body: { text }
      });

      if (error) throw error;
      return data.isRelevant;
    } catch (error) {
      console.error("Error analyzing job content:", error);
      return true; // Keep job by default in case of error
    }
  };

  const cleanupJobs = async () => {
    try {
      setIsProcessing(true);
      console.log("Starting intelligent job cleanup...");

      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', (await supabase.auth.getUser()).data.user?.id);

      if (jobsError) throw jobsError;

      console.log(`Analyzing ${jobs?.length || 0} jobs...`);

      for (const job of jobs || []) {
        const jobContent = `${job.title} ${job.description}`;
        const shouldKeep = await analyzeJobContent(jobContent);
        
        if (!shouldKeep) {
          console.log(`Removing job: ${job.title}`);
          const { error: deleteError } = await supabase
            .from('jobs')
            .delete()
            .eq('id', job.id);

          if (deleteError) {
            console.error(`Error deleting job ${job.id}:`, deleteError);
            toast.error(`Erreur lors de la suppression de la mission: ${job.title}`);
          } else {
            toast.success(`Mission supprimée: ${job.title}`);
          }
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['jobs'] });
      await queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      
      toast.success("Nettoyage des missions terminé !");
    } catch (error) {
      console.error("Error during job cleanup:", error);
      toast.error("Une erreur est survenue lors du nettoyage des missions");
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
        'Nettoyer les missions'
      )}
    </Button>
  );
}