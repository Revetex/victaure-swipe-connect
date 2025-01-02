export interface ScrapedJob {
  external_id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary_range?: string;
  url?: string;
  posted_at?: Date;
}

export interface JobScraper {
  scrape(url: string): Promise<ScrapedJob[]>;
}