import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

export class JobSearchAgent {
  private supabase;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async searchJobs() {
    console.log("Job Search Agent: Starting job search...");
    try {
      const jobs = await this.fetchJobsFromSources();
      await this.saveJobsToDatabase(jobs);
      return { success: true, message: "Jobs updated successfully" };
    } catch (error) {
      console.error("Job Search Agent error:", error);
      return { success: false, error: error.message };
    }
  }

  private async fetchJobsFromSources() {
    const { data: sources, error } = await this.supabase
      .from('job_sources')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;

    const jobs = [];
    for (const source of sources) {
      try {
        const sourceJobs = await this.scrapeJobSource(source);
        jobs.push(...sourceJobs);
      } catch (error) {
        console.error(`Error scraping source ${source.url}:`, error);
      }
    }

    return jobs;
  }

  private async scrapeJobSource(source: any) {
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    if (!doc) {
      throw new Error('Failed to parse HTML');
    }

    // Implement specific scraping logic based on source type
    switch (source.source) {
      case 'linkedin':
        return this.scrapeLinkedIn(doc);
      case 'indeed':
        return this.scrapeIndeed(doc);
      default:
        return [];
    }
  }

  private scrapeLinkedIn(doc: any) {
    const jobs = [];
    const jobCards = doc.querySelectorAll('.job-card-container');

    jobCards.forEach((card: any) => {
      const job = {
        title: card.querySelector('.job-card-list__title')?.textContent?.trim(),
        company: card.querySelector('.job-card-container__company-name')?.textContent?.trim(),
        location: card.querySelector('.job-card-container__metadata-item')?.textContent?.trim(),
        url: card.querySelector('a')?.getAttribute('href'),
        description: card.querySelector('.job-card-list__description')?.textContent?.trim()
      };

      if (job.title && job.company) {
        jobs.push(job);
      }
    });

    return jobs;
  }

  private scrapeIndeed(doc: any) {
    const jobs = [];
    const jobCards = doc.querySelectorAll('.job_seen_beacon');

    jobCards.forEach((card: any) => {
      const job = {
        title: card.querySelector('.jobTitle')?.textContent?.trim(),
        company: card.querySelector('.companyName')?.textContent?.trim(),
        location: card.querySelector('.companyLocation')?.textContent?.trim(),
        salary: card.querySelector('.salary-snippet')?.textContent?.trim(),
        description: card.querySelector('.job-snippet')?.textContent?.trim()
      };

      if (job.title && job.company) {
        jobs.push(job);
      }
    });

    return jobs;
  }

  private async saveJobsToDatabase(jobs: any[]) {
    for (const job of jobs) {
      const { error } = await this.supabase
        .from('scraped_jobs')
        .upsert({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          salary_range: job.salary,
          url: job.url,
          posted_at: new Date().toISOString()
        });

      if (error) {
        console.error("Error saving job:", error);
        throw error;
      }
    }
  }
}