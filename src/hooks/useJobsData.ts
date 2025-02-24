
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";
import { toast } from "sonner";

export const useJobsData = () => {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        console.log("Fetching jobs...");
        
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

        if (error) {
          console.error("Error fetching internal jobs:", error);
          throw error;
        }

        console.log("Internal jobs fetched:", jobs?.length || 0);

        // Récupérer les emplois scrapés
        const { data: scrapedJobs, error: scrapedError } = await supabase
          .from('scraped_jobs')
          .select('*')
          .order('posted_at', { ascending: false });

        if (scrapedError) {
          console.error("Error fetching scraped jobs:", scrapedError);
          throw scrapedError;
        }

        console.log("Scraped jobs fetched:", scrapedJobs?.length || 0);

        // Formatter les emplois internes
        const formattedInternalJobs: Job[] = (jobs || []).map(job => {
          try {
            let interviewProcess = [];
            let applicationSteps = [];

            // Gestion sécurisée de interview_process
            if (job.interview_process) {
              if (typeof job.interview_process === 'string') {
                interviewProcess = JSON.parse(job.interview_process);
              } else if (Array.isArray(job.interview_process)) {
                interviewProcess = job.interview_process;
              }
            }

            // Gestion sécurisée de application_steps
            if (job.application_steps) {
              if (typeof job.application_steps === 'string') {
                applicationSteps = JSON.parse(job.application_steps);
              } else if (Array.isArray(job.application_steps)) {
                applicationSteps = job.application_steps;
              }
            }

            return {
              id: job.id,
              title: job.title,
              description: job.description || '',
              budget: job.budget || 0,
              location: job.location || '',
              employer_id: job.employer_id || '',
              status: 'open',
              category: job.category || 'Technology',
              contract_type: job.contract_type || 'FULL_TIME',
              experience_level: job.experience_level || 'mid-level',
              created_at: job.created_at,
              source: "internal",
              company: job.employer?.company_name || "Entreprise non spécifiée",
              url: `/jobs/${job.id}`,
              mission_type: 'company',
              salary_min: job.salary_min || undefined,
              salary_max: job.salary_max || undefined,
              interview_process: interviewProcess,
              application_steps: applicationSteps
            };
          } catch (error) {
            console.error('Error formatting internal job:', error, job);
            return null;
          }
        }).filter(Boolean) as Job[];

        console.log("Formatted internal jobs:", formattedInternalJobs.length);

        // Formatter les emplois scrapés
        const formattedScrapedJobs: Job[] = (scrapedJobs || []).map(job => {
          try {
            let salary_min, salary_max;
            
            if (job.salary_range) {
              const [min, max] = job.salary_range.split('-').map(s => parseFloat(s.trim()));
              salary_min = !isNaN(min) ? min : undefined;
              salary_max = !isNaN(max) ? max : undefined;
            }

            return {
              id: job.id,
              title: job.title,
              description: job.description || '',
              budget: 0,
              location: job.location || '',
              employer_id: '',
              status: 'open',
              category: 'Technology',
              contract_type: job.employment_type || 'FULL_TIME',
              experience_level: job.experience_level || 'mid-level',
              created_at: job.posted_at,
              source: "external",
              company: job.company || "Entreprise externe",
              url: job.url,
              mission_type: 'company',
              salary: job.salary_range,
              skills: Array.isArray(job.skills) ? job.skills : [],
              interview_process: [],
              application_steps: [],
              salary_min,
              salary_max
            };
          } catch (error) {
            console.error('Error formatting scraped job:', error, job);
            return null;
          }
        }).filter(Boolean) as Job[];

        console.log("Formatted scraped jobs:", formattedScrapedJobs.length);

        // Combiner et retourner tous les emplois
        const allJobs = [...formattedInternalJobs, ...formattedScrapedJobs];
        
        console.log("Total jobs loaded:", {
          totalJobs: allJobs.length,
          internalJobs: formattedInternalJobs.length,
          scrapedJobs: formattedScrapedJobs.length,
        });

        if (allJobs.length === 0) {
          console.warn("No jobs found in the database");
          toast.warning("Aucune offre d'emploi trouvée, veuillez réessayer plus tard");
        }

        return allJobs;
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Impossible de charger les offres d'emploi");
        throw error;
      }
    },
    refetchInterval: 300000, // Rafraîchir toutes les 5 minutes
    staleTime: 60000, // Considérer les données comme périmées après 1 minute
    retry: 3, // Réessayer 3 fois en cas d'échec
    retryDelay: 1000, // Attendre 1 seconde entre chaque tentative
  });
};
