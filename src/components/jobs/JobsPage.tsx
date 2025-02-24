
import { useState } from "react";
import { Job } from "@/types/job";
import { useJobsData } from "@/hooks/useJobsData";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { JobsSearch } from "./sections/JobsSearch";
import { JobsFilters } from "./sections/JobsFilters";
import { JobsResults } from "./sections/JobsResults";
import { JobsAIAssistant } from "./sections/JobsAIAssistant";
import { CreateJobForm } from "./CreateJobForm";
import { PlusCircle } from "lucide-react";

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header et actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold">Emplois disponibles</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Publier une offre
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
                <DialogTitle>Créer une offre d'emploi</DialogTitle>
                <CreateJobForm />
              </DialogContent>
            </Dialog>
          </div>

          {/* Recherche unifiée */}
          <Card className="p-6">
            <JobsSearch 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filtres */}
            <div className="lg:col-span-3">
              <Card className="sticky top-4">
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
              </Card>
            </div>

            {/* Résultats */}
            <div className="lg:col-span-9">
              <JobsResults 
                jobs={filteredJobs}
                onJobSelect={handleJobSelect}
                selectedJobId={selectedJobId}
                onResetFilters={() => {
                  setSearchQuery("");
                  setSelectedLocation("");
                  setSelectedCompanyType("");
                  setExperienceLevel("");
                  setContractType("");
                  setSalaryRange([0, 200000]);
                  setRemoteOnly(false);
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <JobsAIAssistant 
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
}
