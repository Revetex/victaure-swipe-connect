import { JobScraper, ScrapedJob } from "../types.ts";
import { parseSalary } from "../utils/salaryParser.ts";
import { parseLocation } from "../utils/locationParser.ts";
import { parseDate } from "../utils/dateParser.ts";

export class LinkedInScraper implements JobScraper {
  async scrape(url: string): Promise<ScrapedJob[]> {
    try {
      console.log("Starting LinkedIn scraping for URL:", url);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      console.log("Received HTML content length:", html.length);
      
      const jobs: ScrapedJob[] = [];
      const jobListings = html.match(/<div class="base-card relative.*?<\/div>/gs) || [];
      
      console.log("Found job listings:", jobListings.length);

      for (const listing of jobListings) {
        try {
          const titleMatch = listing.match(/class="base-search-card__title".*?>([^<]*)</);
          const companyMatch = listing.match(/class="base-search-card__subtitle".*?>([^<]*)</);
          const locationMatch = listing.match(/class="job-search-card__location".*?>([^<]*)</);
          const linkMatch = listing.match(/href="([^"]*\/view\/[^"]*)"/);
          const idMatch = linkMatch ? linkMatch[1].match(/\d+\/?$/) : null;
          
          if (!titleMatch || !companyMatch || !locationMatch || !idMatch) {
            console.log("Skipping incomplete job listing");
            continue;
          }

          const job: ScrapedJob = {
            external_id: idMatch[0],
            title: titleMatch[1].trim(),
            company: companyMatch[1].trim(),
            location: parseLocation(locationMatch[1].trim()),
            description: '',
            url: linkMatch[1],
            posted_at: new Date()
          };

          jobs.push(job);
          console.log("Processed job:", job.title);
        } catch (error) {
          console.error("Error processing job listing:", error);
        }
      }

      console.log("Successfully scraped jobs:", jobs.length);
      return jobs;
    } catch (error) {
      console.error('Error in LinkedIn scraper:', error);
      throw error;
    }
  }
}