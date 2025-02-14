
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UnifiedJob, JobTranscription } from "@/types/jobs/types";
import { Job } from "@/types/job";
import { toast } from "sonner";

type MissionType = "company" | "individual";

export const useJobsData = (queryString: string = "") => {
  return useQuery({
    queryKey: ["all-jobs", queryString],
    queryFn: async () => {
      try {
        // Récupérer tous les emplois Victaure avec leurs transcriptions
        const { data: victaureJobs = [], error: victaureError } = await supabase
          .from('jobs')
          .select(`
            *,
            employer:profiles(
              company_name,
              avatar_url
            ),
            job_transcriptions(
              ai_transcription
            )
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (victaureError) throw victaureError;

        // Récupérer tous les emplois externes avec leurs transcriptions
        const { data: scrapedJobs = [], error: scrapedError } = await supabase
          .from('scraped_jobs')
          .select(`
            *,
            job_transcriptions(
              ai_transcription
            )
          `)
          .order('posted_at', { ascending: false });

        if (scrapedError) throw scrapedError;

        // Formater de manière uniforme
        const formattedJobs = [
          ...victaureJobs.map(job => {
            const missionType: MissionType = 
              job.mission_type === 'individual' ? 'individual' : 'company';
            
            // Parse interview_process as array or provide empty array if invalid
            const interviewProcess = job.interview_process 
              ? (Array.isArray(job.interview_process) ? job.interview_process : [])
              : [];
            
            return {
              ...job,
              company: job.employer?.company_name || job.company_name || 'Entreprise',
              url: `/jobs/${job.id}`,
              source: "internal" as const,
              mission_type: missionType,
              employer: {
                company_name: job.employer?.company_name,
                avatar_url: job.employer?.avatar_url
              },
              status: job.status as "open" | "closed" | "in-progress",
              interview_process: interviewProcess,
              application_steps: job.application_steps || [],
              salary_benefits: job.salary_benefits || {},
              company_culture: job.company_culture || [],
              perks: job.perks || [],
              benefits: job.benefits || [],
              languages: job.languages || [],
              qualifications: job.qualifications || [],
              responsibilities: job.responsibilities || [],
              tools_and_technologies: job.tools_and_technologies || [],
              certifications_required: job.certifications_required || [],
              work_schedule: job.work_schedule || []
            } satisfies Job;
          }),
          ...scrapedJobs.map(job => ({
            id: job.id,
            title: job.title,
            description: job.description || '',
            budget: 0,
            location: job.location,
            employer_id: '',
            status: 'open' as const,
            category: job.industry || 'Technology',
            contract_type: job.job_type || 'full-time',
            experience_level: job.experience_level || 'mid-level',
            company: job.company,
            url: job.url,
            source: "external" as const,
            mission_type: 'company' as MissionType,
            interview_process: [],
            application_steps: [],
            salary_benefits: {},
            company_culture: [],
            perks: [],
            benefits: [],
            languages: [],
            qualifications: [],
            responsibilities: [],
            tools_and_technologies: [],
            certifications_required: [],
            work_schedule: []
          } satisfies Job))
        ] as Job[];

        // Filtrer si une recherche est présente
        if (queryString) {
          const searchTerms = queryString.toLowerCase().split(' ');
          return formattedJobs.filter(job => {
            const searchableText = `
              ${job.title} 
              ${job.company || ''} 
              ${job.location} 
              ${job.description || ''} 
            `.toLowerCase();
            
            return searchTerms.every(term => searchableText.includes(term));
          });
        }

        return formattedJobs;

      } catch (error) {
        console.error('Erreur lors de la récupération des emplois:', error);
        toast.error('Erreur lors de la récupération des emplois');
        return [];
      }
    }
  });
};
