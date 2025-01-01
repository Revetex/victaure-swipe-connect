import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { JobPosting } from "../types.ts";
import { parseLocation, isCanadianLocation } from "../utils/locationParser.ts";
import { parseDatePosted } from "../utils/dateParser.ts";
import { extractSalaryRange } from "../utils/salaryParser.ts";

export async function fetchLinkedInJobs(): Promise<JobPosting[]> {
  try {
    console.log('Fetching LinkedIn jobs...');
    const response = await fetch('https://www.linkedin.com/jobs/search?keywords=developer&location=Canada', {
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

    const jobs: JobPosting[] = [];
    const jobCards = doc.querySelectorAll('.job-card-container');

    jobCards.forEach((card) => {
      const title = card.querySelector('.job-card-list__title')?.textContent?.trim() || '';
      const company = card.querySelector('.job-card-container__company-name')?.textContent?.trim() || '';
      const locationRaw = card.querySelector('.job-card-container__metadata-item')?.textContent?.trim() || '';
      const datePosted = card.querySelector('.job-card-container__listed-time')?.textContent?.trim() || '';
      const description = card.querySelector('.job-card-list__description')?.textContent?.trim() || '';
      const url = card.querySelector('a')?.getAttribute('href') || '';
      
      const location = parseLocation(locationRaw);
      if (isCanadianLocation(location)) {
        jobs.push({
          title,
          company,
          location,
          url: `https://www.linkedin.com${url}`,
          platform: 'LinkedIn',
          description,
          posted_at: parseDatePosted(datePosted),
          salary_range: extractSalaryRange(description + ' ' + title)
        });
      }
    });

    console.log(`Found ${jobs.length} LinkedIn jobs in Canada`);
    return jobs;
  } catch (error) {
    console.error('Error fetching LinkedIn jobs:', error);
    return [];
  }
}