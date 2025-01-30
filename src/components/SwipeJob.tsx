import { useState } from "react";
import { JobFilters } from "./jobs/JobFilterUtils";
import { useSwipeMatch } from "@/hooks/useSwipeMatch";
import { SwipeControls } from "./jobs/swipe/SwipeControls";
import { SwipeEmptyState } from "./jobs/swipe/SwipeEmptyState";
import { AnimatedJobCard } from "./jobs/AnimatedJobCard";
import { JobFiltersPanel } from "./jobs/JobFiltersPanel";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function SwipeJob() {
  const [filters, setFilters] = useState<JobFilters>({
    category: "all",
    subcategory: "all",
    duration: "all",
    experienceLevel: "all",
    location: "",
    province: "all",
    remoteType: "all",
    minBudget: 300,
    maxBudget: 1000,
    skills: [],
    searchTerm: "",
    createdAfter: null,
    createdBefore: null,
    deadlineBefore: null,
    categories: [],
  });

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
  } = useSwipeMatch(filters, handleMatchSuccess);

  return (
    <div className="relative h-full flex flex-col lg:flex-row gap-6 p-4">
      <div className="w-full lg:w-80 shrink-0">
        <JobFiltersPanel 
          filters={filters} 
          onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
          className="sticky top-4 space-y-6 bg-card p-6 rounded-lg border shadow-sm"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start min-h-[600px] pt-4">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : jobs.length === 0 ? (
          <SwipeEmptyState onRefresh={() => setFilters(prev => ({ ...prev }))} />
        ) : (
          <>
            <div className="relative w-full max-w-lg aspect-[3/4] mx-auto">
              {jobs.map((job, index) => {
                if (index < currentIndex) return null;
                
                const isTop = index === currentIndex;
                const isDraggable = isTop && !isAnimating;
                
                return (
                  <AnimatedJobCard
                    key={job.id}
                    job={job}
                    x={x}
                    rotate={rotate}
                    opacity={opacity}
                    scale={scale}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
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
      </div>
    </div>
  );
}