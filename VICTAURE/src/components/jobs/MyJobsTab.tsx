import { JobList } from "./JobList";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";

export function MyJobsTab() {
  const { data: myJobs, refetch: refetchMyJobs, isLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour voir vos annonces");
        return [];
      }
      
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching my jobs:', error);
        toast.error("Erreur lors du chargement de vos annonces");
        return [];
      }
      
      return data?.map(job => ({
        ...job,
        company: "Votre entreprise",
        salary: `${job.budget} CAD`,
        skills: job.required_skills || []
      })) as Job[];
    }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <h3 className="text-lg font-semibold">Mes annonces publiées</h3>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : myJobs && myJobs.length > 0 ? (
        <JobList 
          jobs={myJobs} 
          onJobDeleted={() => {
            refetchMyJobs();
            toast.success("Annonce supprimée avec succès");
          }} 
        />
      ) : (
        <p className="text-muted-foreground text-center py-8">
          Vous n'avez pas encore publié d'annonces.
        </p>
      )}
    </motion.div>
  );
}