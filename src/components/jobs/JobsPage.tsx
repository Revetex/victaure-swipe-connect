
import { useState } from "react";
import { Job } from "@/types/job";
import { useJobsData } from "@/hooks/useJobsData";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { JobsHeader } from "./sections/JobsHeader";
import { JobsSearch } from "./sections/JobsSearch";
import { JobsFilters } from "./sections/JobsFilters";
import { JobsResults } from "./sections/JobsResults";

export function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCompanyType, setSelectedCompanyType] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"recent" | "salary">("recent");
  const { data: jobs = [], isLoading } = useJobsData();
  const [selectedJobId, setSelectedJobId] = useState<string>();

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation = !selectedLocation || 
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesCompanyType = !selectedCompanyType || 
        (selectedCompanyType === "internal" ? job.source === "internal" : job.source === "external");

      return matchesSearch && matchesLocation && matchesCompanyType;
    })
    .sort((a, b) => {
      if (sortOrder === "recent") {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
      const aMaxSalary = a.salary_max || a.salary_min || 0;
      const bMaxSalary = b.salary_max || b.salary_min || 0;
      return bMaxSalary - aMaxSalary;
    });

  const locations = Array.from(new Set(jobs.map(job => job.location))).sort();

  const handleJobSelect = (job: Job) => {
    setSelectedJobId(job.id);
    toast.info("Détails de l'emploi disponibles bientôt !");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setSelectedCompanyType("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-4 max-w-7xl"
    >
      <div className="space-y-6">
        <JobsHeader totalJobs={jobs.length} />
        
        <JobsSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <JobsFilters
          selectedLocation={selectedLocation}
          selectedCompanyType={selectedCompanyType}
          sortOrder={sortOrder}
          locations={locations}
          onLocationChange={setSelectedLocation}
          onCompanyTypeChange={setSelectedCompanyType}
          onSortOrderChange={setSortOrder}
        />
        
        <JobsResults
          jobs={filteredJobs}
          onJobSelect={handleJobSelect}
          selectedJobId={selectedJobId}
          onResetFilters={handleResetFilters}
        />
      </div>
    </motion.div>
  );
}
