
export interface UnifiedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  posted_at: string;
  source: 'Victaure' | 'Externe';
  description?: string;
  transcription?: string;
  logo_url?: string;
}

export interface JobTranscription {
  ai_transcription: string;
}

export interface ScrapedJobsListProps {
  queryString?: string;
}
