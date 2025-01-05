import { JobScraper, ScrapedJob } from "../types.ts";
import { parseSalary } from "../utils/salaryParser.ts";
import { parseLocation } from "../utils/locationParser.ts";
import { parseDate } from "../utils/dateParser.ts";

export class IndeedScraper implements JobScraper {
  async scrape(url: string): Promise<ScrapedJob[]> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const jobs: ScrapedJob[] = [];

      // Basic parsing using string manipulation (in production, use a proper HTML parser)
      const jobListings = html.match(/<div class="job_seen_beacon".*?<\/div>/gs) || [];

      for (const listing of jobListings) {
        const title = listing.match(/class="jobTitle".*?>(.*?)<\//) || ['', ''];
        const company = listing.match(/class="companyName".*?>(.*?)<\//) || ['', ''];
        const location = listing.match(/class="companyLocation".*?>(.*?)<\//) || ['', ''];
        const salary = listing.match(/class="salary-snippet".*?>(.*?)<\//) || ['', ''];
        const posted = listing.match(/class="date".*?>(.*?)<\//) || ['', ''];
        const url = listing.match(/href="(.*?)"/) || ['', ''];
        const id = url[1].split('?').shift()?.split('/').pop() || '';

        jobs.push({
          external_id: id,
          title: title[1].trim(),
          company: company[1].trim(),
          location: parseLocation(location[1].trim()),
          salary_range: parseSalary(salary[1].trim()),
          posted_at: parseDate(posted[1].trim()),
          url: `https://www.indeed.com${url[1]}`,
          description: ''  // Would need additional request to get full description
        });
      }

      return jobs;
    } catch (error) {
      console.error('Error in Indeed scraper:', error);
      throw error;
    }
  }
}