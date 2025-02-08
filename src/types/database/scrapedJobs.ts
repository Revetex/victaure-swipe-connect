
export interface ScrapedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  url?: string;
  posted_at: string;
  created_at: string;
  updated_at: string;
}
