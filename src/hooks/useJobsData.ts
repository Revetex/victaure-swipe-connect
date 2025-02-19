
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

        const formattedJobs: Job[] = [
          ...(jobs || []).map(job => ({
            ...job,
            source: "internal" as const,
            company: job.employer?.company_name || "Entreprise non spécifiée",
            url: `/jobs/${job.id}`,
            status: job.status as 'open' | 'closed' | 'in-progress',
            mission_type: (job.mission_type || 'company') as 'company' | 'individual',
            salary_min: typeof job.salary_min === 'number' ? job.salary_min : undefined,
            salary_max: typeof job.salary_max === 'number' ? job.salary_max : undefined
          })),
          ...(scrapedJobs || []).map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            description: job.description || '',
            budget: 0,
            employer_id: '',
            status: 'open' as const,
            category: 'Technology',
            contract_type: job.employment_type || 'FULL_TIME',
            experience_level: job.experience_level || 'mid-level',
            created_at: job.posted_at,
            source: "external" as const,
            url: job.url,
            salary: job.salary_range,
            skills: job.skills || [],
            mission_type: 'company' as const,
            // Convertir les salaires depuis salary_range si disponible
            salary_min: job.salary_range ? parseFloat(job.salary_range.split('-')[0]) || undefined : undefined,
            salary_max: job.salary_range ? parseFloat(job.salary_range.split('-')[1]) || undefined : undefined
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
