export interface ScrapedJob {
  external_id: string;
  title: string;
  company: string;
  location: string;
  salary_range?: string;
  description?: string;
  url?: string;
  posted_at: string;
  source: string;
}

export interface JobScraper {
  scrape(url: string): Promise<ScrapedJob[]>;
}