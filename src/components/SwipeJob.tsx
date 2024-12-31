import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Plus, Filter } from "lucide-react";
import { JobList } from "@/components/jobs/JobList";
import { useNavigate } from "react-router-dom";
import { useSwipeJobs } from "./jobs/hooks/useSwipeJobs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { JobFiltersPanel } from "./jobs/JobFiltersPanel";
import { defaultFilters } from "./jobs/JobFilterUtils";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function SwipeJob() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(defaultFilters);
  const { 
    jobs, 
    currentIndex, 
    isLoading, 
    error, 
    refetch, 
    handlePrevious, 
    handleNext 
  } = useSwipeJobs(filters);

  const handleCreateJob = () => {
    navigate("/jobs/create");
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const currentJob = jobs[currentIndex];

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Swipe des missions</h2>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                  </SheetHeader>
                  <JobFiltersPanel 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    openLocation={false}
                    setOpenLocation={() => {}}
                  />
                </SheetContent>
              </Sheet>
              <Button onClick={handleCreateJob} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Créer une mission
              </Button>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === (jobs?.length || 0) - 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden">
                {currentJob ? (
                  <div className="p-8 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-semibold">{currentJob.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{currentJob.category}</Badge>
                        <Badge variant="outline">{currentJob.contract_type}</Badge>
                        <Badge variant="outline">{currentJob.experience_level}</Badge>
                      </div>
                    </div>

                    <div className="prose prose-sm dark:prose-invert">
                      <p>{currentJob.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Budget:</span>
                        <p className="font-medium">{currentJob.budget} CAD</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Localisation:</span>
                        <p className="font-medium">{currentJob.location}</p>
                      </div>
                    </div>

                    {currentJob.required_skills && currentJob.required_skills.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Compétences requises:</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentJob.required_skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[4/3] flex items-center justify-center">
                    <p className="text-muted-foreground">Aucune mission à afficher</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Mes annonces publiées</h3>
          {jobs && jobs.length > 0 ? (
            <JobList 
              jobs={jobs} 
              onJobDeleted={refetch}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Vous n'avez pas encore publié d'annonces.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}