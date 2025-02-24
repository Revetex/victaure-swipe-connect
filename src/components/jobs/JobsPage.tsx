
import { useState } from "react";
import { Job } from "@/types/job";
import { useJobsData } from "@/hooks/useJobsData";
import { motion } from "framer-motion";
import { JobsSearch } from "./sections/JobsSearch";
import { JobsFilters } from "./sections/JobsFilters";
import { JobsResults } from "./sections/JobsResults";
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
  const { data: jobs = [], isLoading } = useJobsData();
  const [selectedJobId, setSelectedJobId] = useState<string>();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-background to-background/95 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <header className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
              Trouvez votre prochain emploi
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Découvrez les meilleures opportunités d'emploi adaptées à votre profil
            </p>
          </header>

          <JobsSearch 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
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
            onReset={handleResetFilters}
          />

          <div className="grid lg:grid-cols-[280px,1fr] gap-6">
            <aside className="hidden lg:block">
              <JobsFilters
                locations={locations}
                selectedLocation={selectedLocation}
                selectedCompanyType={selectedCompanyType}
                sortOrder={sortOrder}
                experienceLevel={experienceLevel}
                contractType={contractType}
                salaryRange={salaryRange}
                remoteOnly={remoteOnly}
                onLocationChange={setSelectedLocation}
                onCompanyTypeChange={setSelectedCompanyType}
                onSortOrderChange={setSortOrder}
                onExperienceLevelChange={setExperienceLevel}
                onContractTypeChange={setContractType}
                onSalaryRangeChange={setSalaryRange}
                onRemoteOnlyChange={setRemoteOnly}
                onReset={handleResetFilters}
              />
            </aside>

            <main>
              <JobsResults 
                jobs={filteredJobs}
                onJobSelect={handleJobSelect}
                selectedJobId={selectedJobId}
                onResetFilters={handleResetFilters}
              />
            </main>
          </div>

          {isAssistantOpen && (
            <JobsAIAssistant 
              isOpen={isAssistantOpen}
              onClose={() => setIsAssistantOpen(false)}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
