
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UnifiedJob, JobTranscription } from "@/types/jobs/types";
import { Job } from "@/types/job";
import { toast } from "sonner";

type MissionType = "company" | "individual";

// Helper function to safely parse JSON array
const parseJsonArray = (value: unknown): any[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// Helper function to safely parse JSON object
const parseJsonObject = (value: unknown): Record<string, any> => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, any>;
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
};

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
            const interviewProcess = parseJsonArray(job.interview_process);
            const applicationSteps = parseJsonArray(job.application_steps);
            const salaryBenefits = parseJsonObject(job.salary_benefits);
            
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
              application_steps: applicationSteps,
              salary_benefits: salaryBenefits,
              company_culture: Array.isArray(job.company_culture) ? job.company_culture : [],
              perks: Array.isArray(job.perks) ? job.perks : [],
              benefits: Array.isArray(job.benefits) ? job.benefits : [],
              languages: Array.isArray(job.languages) ? job.languages : [],
              qualifications: Array.isArray(job.qualifications) ? job.qualifications : [],
              responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : [],
              tools_and_technologies: Array.isArray(job.tools_and_technologies) ? job.tools_and_technologies : [],
              certifications_required: Array.isArray(job.certifications_required) ? job.certifications_required : [],
              work_schedule: Array.isArray(job.work_schedule) ? job.work_schedule : []
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
