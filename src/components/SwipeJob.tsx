
import { useState } from "react";
import { useJobFilters } from "@/hooks/useJobFilters";
import { useSwipeMatch } from "@/hooks/useSwipeMatch";
import { SwipeControls } from "./jobs/swipe/SwipeControls";
import { SwipeEmptyState } from "./jobs/swipe/SwipeEmptyState";
import { AnimatedJobCard } from "./jobs/AnimatedJobCard";
import { JobFiltersPanel } from "./jobs/JobFiltersPanel";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SwipeJob() {
  const navigate = useNavigate();
  const { filters, updateFilter } = useJobFilters();
  const [showFilters, setShowFilters] = useState(false);

  const handleMatchSuccess = async (jobId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour postuler");
        return;
      }

      const { error } = await supabase.from('matches').insert({
        job_id: jobId,
        professional_id: user.id,
        status: 'pending'
      });

      if (error) throw error;
      toast.success("Candidature envoyée avec succès!");
    } catch (error) {
      console.error('Error creating match:', error);
      toast.error("Erreur lors de l'envoi de la candidature");
    }
  };

  const {
    jobs,
    currentIndex,
    loading,
    swipeDirection,
    isDragging,
    isAnimating,
    x,
    rotate,
    opacity,
    scale,
    background,
    handleDragStart,
    handleDragEnd,
    handleButtonSwipe,
    fetchJobs,
    setCurrentIndex,
  } = useSwipeMatch(filters, handleMatchSuccess);

  return (
    <div className="relative min-h-[600px] flex flex-col lg:flex-row gap-6">
      <aside className={`lg:w-80 shrink-0 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] transition-all ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <JobFiltersPanel 
          filters={filters} 
          onFilterChange={updateFilter}
        />
      </aside>

      <main className="flex-1 flex flex-col items-center justify-start min-h-[600px] pt-4">
        <div className="w-full flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            className="lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </Button>
          <Button
            onClick={() => navigate('/jobs/create')}
            className="ml-auto"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une annonce
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length === 0 ? (
          <SwipeEmptyState onRefresh={() => fetchJobs()} />
        ) : (
          <>
            <div className="relative w-full max-w-lg mx-auto aspect-[3/4]">
              {jobs.map((job, index) => {
                if (index < currentIndex) return null;
                
                const isTop = index === currentIndex;
                const isDraggable = isTop && !isAnimating;
                
                return (
                  <AnimatedJobCard
                    key={job.id}
                    job={job}
                    x={isTop ? x : 0}
                    rotate={isTop ? rotate : 0}
                    opacity={isTop ? opacity : 1}
                    scale={isTop ? scale : 1}
                    onDragStart={isDraggable ? handleDragStart : undefined}
                    onDragEnd={isDraggable ? handleDragEnd : undefined}
                    isDragging={isDragging}
                  />
                );
              })}
            </div>

            <SwipeControls
              onSwipe={handleButtonSwipe}
              isAnimating={isAnimating}
              className="mt-8"
            />
          </>
        )}
      </main>
    </div>
  );
}
