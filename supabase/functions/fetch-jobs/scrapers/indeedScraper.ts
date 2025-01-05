import { JobScraper, ScrapedJob } from "../types.ts";
import { parseSalary } from "../utils/salaryParser.ts";
import { parseLocation } from "../utils/locationParser.ts";
import { parseDate } from "../utils/dateParser.ts";

export class IndeedScraper implements JobScraper {
  async scrape(url: string): Promise<ScrapedJob[]> {
    try {
      console.log("Starting Indeed scraping for URL:", url);
      
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
      const jobListings = html.match(/<div class="job_seen_beacon".*?<\/div>/gs) || [];
      
      console.log("Found job listings:", jobListings.length);

      for (const listing of jobListings) {
        try {
          const titleMatch = listing.match(/data-jk="([^"]*)".*?title="([^"]*)"/);
          const companyMatch = listing.match(/class="companyName".*?>([^<]*)</);
          const locationMatch = listing.match(/class="companyLocation".*?>([^<]*)</);
          const descriptionMatch = listing.match(/class="job-snippet".*?>([^<]*)</);
          
          if (!titleMatch || !companyMatch || !locationMatch) {
            console.log("Skipping incomplete job listing");
            continue;
          }

          const job: ScrapedJob = {
            external_id: titleMatch[1],
            title: titleMatch[2].trim(),
            company: companyMatch[1].trim(),
            location: parseLocation(locationMatch[1].trim()),
            description: descriptionMatch ? descriptionMatch[1].trim() : '',
            url: `https://www.indeed.com/viewjob?jk=${titleMatch[1]}`,
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
      console.error('Error in Indeed scraper:', error);
      throw error;
    }
  }
}