
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { UnifiedJob, JobTranscription } from "@/types/jobs/types";
import { toast } from "sonner";

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
        const formattedJobs: UnifiedJob[] = [
          ...victaureJobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.employer?.company_name || job.company_name || 'Entreprise',
            location: job.location,
            url: `/jobs/${job.id}`,
            posted_at: job.created_at,
            source: 'Victaure' as const,
            description: job.description,
            transcription: (job.job_transcriptions?.[0] as JobTranscription | undefined)?.ai_transcription,
            logo_url: job.employer?.avatar_url
          })),
          ...scrapedJobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            url: job.url,
            posted_at: job.posted_at,
            source: 'Externe' as const,
            description: job.description,
            transcription: (job.job_transcriptions?.[0] as JobTranscription | undefined)?.ai_transcription
          }))
        ];

        // Filtrer si une recherche est présente
        if (queryString) {
          const searchTerms = queryString.toLowerCase().split(' ');
          return formattedJobs.filter(job => {
            const searchableText = `
              ${job.title} 
              ${job.company} 
              ${job.location} 
              ${job.description || ''} 
              ${job.transcription || ''}
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
