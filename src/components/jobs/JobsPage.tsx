import { useState } from "react";
import { Job } from "@/types/job";
import { useJobsData } from "@/hooks/useJobsData";
import { motion } from "framer-motion";
import { JobsSearch } from "./sections/JobsSearch";
import { JobsResults } from "./sections/JobsResults";
import { cn } from "@/lib/utils";
import { GoogleSearch } from "@/components/google-search/GoogleSearch";
import { Card } from "@/components/ui/card";
import { JobsAIAssistant } from "./sections/JobsAIAssistant";
export function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCompanyType, setSelectedCompanyType] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"recent" | "salary">("recent");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [contractType, setContractType] = useState<string>("");
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 200000]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const {
    data: jobs = [],
    isLoading
  } = useJobsData();
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.company?.toLowerCase().includes(searchQuery.toLowerCase()) || job.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !selectedLocation || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesCompanyType = !selectedCompanyType || (selectedCompanyType === "internal" ? job.source === "internal" : job.source === "external");
    const matchesExperience = !experienceLevel || job.experience_level?.toLowerCase() === experienceLevel.toLowerCase();
    const matchesContractType = !contractType || job.contract_type?.toLowerCase() === contractType.toLowerCase();
    const matchesSalary = (!job.salary_min || job.salary_min >= salaryRange[0]) && (!job.salary_max || job.salary_max <= salaryRange[1]);
    const matchesRemote = !remoteOnly || job.remote_type === "full" || job.remote_type === "hybrid";
    return matchesSearch && matchesLocation && matchesCompanyType && matchesExperience && matchesContractType && matchesSalary && matchesRemote;
  }).sort((a, b) => {
    if (sortOrder === "recent") {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
    const aMaxSalary = a.salary_max || a.salary_min || 0;
    const bMaxSalary = b.salary_max || b.salary_min || 0;
    return bMaxSalary - aMaxSalary;
  });
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>;
  }
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} className={cn("min-h-screen bg-background dark:bg-[#1A1F2C] px-4 py-6")}>
      <div className="max-w-7xl mx-auto space-y-6">
        <JobsSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedLocation={selectedLocation} selectedCompanyType={selectedCompanyType} sortOrder={sortOrder} experienceLevel={experienceLevel} contractType={contractType} salaryRange={salaryRange} remoteOnly={remoteOnly} onLocationChange={setSelectedLocation} onCompanyTypeChange={setSelectedCompanyType} onSortOrderChange={setSortOrder} onExperienceLevelChange={setExperienceLevel} onContractTypeChange={setContractType} onSalaryRangeChange={setSalaryRange} onRemoteOnlyChange={setRemoteOnly} />
        
        <Card className="bg-card dark:bg-[#1B2A4A]/50 backdrop-blur-sm border-border/10 dark:border-[#64B5D9]/10 rounded-lg p-6 shadow-lg mx-0 px-0 py-0">
          <h2 className="text-xl font-semibold text-foreground dark:text-white mb-4">
            Recherche intelligente d'emplois
          </h2>
          <GoogleSearch />
        </Card>

        <JobsAIAssistant jobs={filteredJobs} />
        
        
      </div>
    </motion.div>;
}