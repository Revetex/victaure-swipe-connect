import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { JobList } from "@/components/jobs/JobList";
import { JobFilters as JobFiltersType, defaultFilters } from "./jobs/JobFilterUtils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function SwipeJob() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<JobFiltersType>(defaultFilters);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { 
    data: myJobs = [], 
    refetch: refetchMyJobs, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:profiles(
            full_name,
            company_name,
            avatar_url
          )
        `)
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      toast.info("Vous êtes au début de la liste");
    }
  };

  const handleNext = () => {
    if (currentIndex < myJobs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.info("Vous êtes à la fin de la liste");
    }
  };

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
              disabled={currentIndex === myJobs.length - 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
            {myJobs[currentIndex] ? (
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">{myJobs[currentIndex].title}</h3>
                <p className="text-muted-foreground">{myJobs[currentIndex].description}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">Aucune mission à afficher</p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Mes annonces publiées</h3>
          {myJobs && myJobs.length > 0 ? (
            <JobList 
              jobs={myJobs} 
              onJobDeleted={refetchMyJobs}
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