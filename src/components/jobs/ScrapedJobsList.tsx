import { useEffect, useState } from "react";
import { JobList } from "./JobList";
import { FilterSection } from "./filters/FilterSection";
import { Job } from "@/types/job";
import { useJobFilters } from "@/hooks/useJobFilters";

export function ScrapedJobsList() {
  const { filters, updateFilter, resetFilters } = useJobFilters();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    // Simulate fetching jobs based on filters
    const fetchedJobs = [
      {
        id: "1",
        title: "Software Engineer",
        company: "Tech Corp",
        location: "San Francisco",
        salary: "$120,000 - $150,000",
        description: "Develop and maintain software applications.",
        postedDate: "2 days ago",
        skills: ["JavaScript", "React", "Node.js"],
        category: "Technology",
        experienceLevel: "Mid-Level",
        duration: "Full-time",
        employer_id: "some_employer_id",
        budget: 130000,
        required_skills: ["JavaScript", "React", "Node.js"]
      },
      {
        id: "2",
        title: "Data Scientist",
        company: "Data Solutions Inc.",
        location: "New York",
        salary: "$110,000 - $140,000",
        description: "Analyze data and create machine learning models.",
        postedDate: "5 days ago",
        skills: ["Python", "Machine Learning", "Data Analysis"],
        category: "Data Science",
        experienceLevel: "Senior",
        duration: "Full-time",
        employer_id: "some_employer_id",
        budget: 120000,
        required_skills: ["Python", "Machine Learning", "Data Analysis"]
      },
    ];

    setJobs(fetchedJobs as any);
  }, [filters]);

  return (
    <div className="space-y-4">
      <FilterSection 
        filters={filters} 
        onFilterChange={updateFilter}
        onReset={resetFilters}
      />
      <JobList filters={filters} showFilters={true} jobs={jobs} />
    </div>
  );
}
