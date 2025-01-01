import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";
import { JobPosting } from "../types.ts";
import { parseLocation, isCanadianLocation } from "../utils/locationParser.ts";
import { parseDatePosted } from "../utils/dateParser.ts";
import { extractSalaryRange } from "../utils/salaryParser.ts";

export async function fetchIndeedJobs(): Promise<JobPosting[]> {
  try {
    console.log('Fetching Indeed jobs...');
    const response = await fetch('https://ca.indeed.com/jobs?q=developer&l=Canada', {
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
    const jobCards = doc.querySelectorAll('.job_seen_beacon');

    jobCards.forEach((card) => {
      const title = card.querySelector('.jobTitle')?.textContent?.trim() || '';
      const company = card.querySelector('.companyName')?.textContent?.trim() || '';
      const locationRaw = card.querySelector('.companyLocation')?.textContent?.trim() || '';
      const datePosted = card.querySelector('.date')?.textContent?.trim() || '';
      const description = card.querySelector('.job-snippet')?.textContent?.trim() || '';
      const url = card.querySelector('a')?.getAttribute('href') || '';
      const salaryElem = card.querySelector('.salary-snippet') || card.querySelector('.estimated-salary');
      const salaryRange = salaryElem ? extractSalaryRange(salaryElem.textContent || '') : undefined;

      const location = parseLocation(locationRaw);
      if (isCanadianLocation(location)) {
        jobs.push({
          title,
          company,
          location,
          url: `https://ca.indeed.com${url}`,
          platform: 'Indeed',
          description,
          posted_at: parseDatePosted(datePosted),
          salary_range: salaryRange
        });
      }
    });

    console.log(`Found ${jobs.length} Indeed jobs in Canada`);
    return jobs;
  } catch (error) {
    console.error('Error fetching Indeed jobs:', error);
    return [];
  }
}