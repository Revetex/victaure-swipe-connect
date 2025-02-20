
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
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [contractType, setContractType] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200000]);
  const [remoteOnly, setRemoteOnly] = useState(false);
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

      const matchesExperience = !experienceLevel ||
        job.experience_level?.toLowerCase() === experienceLevel.toLowerCase();

      const matchesContractType = !contractType ||
        job.contract_type?.toLowerCase() === contractType.toLowerCase();

      const matchesSalary = (!job.salary_min || job.salary_min >= salaryRange[0]) &&
        (!job.salary_max || job.salary_max <= salaryRange[1]);

      const matchesRemote = !remoteOnly ||
        job.remote_type === "full" || job.remote_type === "hybrid";

      return matchesSearch && matchesLocation && matchesCompanyType && 
             matchesExperience && matchesContractType && matchesSalary && matchesRemote;
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
    setExperienceLevel("");
    setContractType("");
    setSalaryRange([0, 200000]);
    setRemoteOnly(false);
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
          experienceLevel={experienceLevel}
          contractType={contractType}
          locations={locations}
          salaryRange={salaryRange}
          remoteOnly={remoteOnly}
          onLocationChange={setSelectedLocation}
          onCompanyTypeChange={setSelectedCompanyType}
          onSortOrderChange={setSortOrder}
          onExperienceLevelChange={setExperienceLevel}
          onContractTypeChange={setContractType}
          onSalaryRangeChange={setSalaryRange}
          onRemoteOnlyChange={setRemoteOnly}
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
