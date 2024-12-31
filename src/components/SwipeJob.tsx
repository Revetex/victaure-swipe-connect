import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { JobList } from "@/components/jobs/JobList";
import { useNavigate } from "react-router-dom";
import { useSwipeJobs } from "./jobs/hooks/useSwipeJobs";

export function SwipeJob() {
  const navigate = useNavigate();
  const { 
    jobs, 
    currentIndex, 
    isLoading, 
    error, 
    refetch, 
    handlePrevious, 
    handleNext 
  } = useSwipeJobs();

  const handleCreateJob = () => {
    navigate("/jobs/create");
  };

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Swipe des missions</h2>
            <Button onClick={handleCreateJob} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Créer une mission
            </Button>
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
          <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
            {jobs[currentIndex] ? (
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">{jobs[currentIndex].title}</h3>
                <p className="text-muted-foreground">{jobs[currentIndex].description}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune mission à afficher</p>
            )}
          </div>
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