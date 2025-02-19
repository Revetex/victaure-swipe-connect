
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { toast } from "sonner";

export const useJobsData = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        // Récupérer les emplois de la base de données
        const { data: jobs, error } = await supabase
          .from('jobs')
          .select(`
            *,
            employer:profiles(
              company_name,
              avatar_url
            )
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Récupérer les emplois scrapés
        const { data: scrapedJobs, error: scrapedError } = await supabase
          .from('scraped_jobs')
          .select('*')
          .order('posted_at', { ascending: false })
          .limit(50);

        if (scrapedError) throw scrapedError;

        const formattedJobs = [
          ...(jobs || []).map(job => ({
            ...job,
            source: "internal" as const,
            company: job.employer?.company_name || "Entreprise non spécifiée",
            url: `/jobs/${job.id}`
          })),
          ...(scrapedJobs || []).map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description,
            created_at: job.posted_at,
            source: "external" as const,
            url: job.url,
            salary: job.salary_range,
            experience_level: job.experience_level,
            skills: job.skills || [],
            contract_type: job.employment_type || "FULL_TIME",
            mission_type: "company",
            status: "open" as const
          }))
        ];

        return formattedJobs;
      } catch (error) {
        console.error("Erreur lors de la récupération des emplois:", error);
        toast.error("Impossible de charger les offres d'emploi");
        return [];
      }
    },
    refetchInterval: 300000, // Rafraîchir toutes les 5 minutes
    staleTime: 60000 // Considérer les données comme périmées après 1 minute
  });
};
