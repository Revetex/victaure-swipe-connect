
import { useEffect, useState } from "react";
import { JobFilters } from "../JobFilterUtils";
import { JobFiltersPanel } from "../JobFiltersPanel";
import { ScrapedJobsList } from "../ScrapedJobsList";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSwipeMatch } from "@/hooks/useSwipeMatch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AnimatedJobCard } from "../AnimatedJobCard";
import { SwipeControls } from "../swipe/SwipeControls";
import { SwipeEmptyState } from "../swipe/SwipeEmptyState";
import { useGoogleSearchStyles } from "@/components/google-search/GoogleSearchStyles";
import { GoogleSearchBox } from "@/components/google-search/GoogleSearchBox";
import { AISearchSuggestions } from "@/components/google-search/AISearchSuggestions";

interface ExternalSearchSectionProps {
  filters: JobFilters;
  onFilterChange: (key: keyof JobFilters, value: any) => void;
}

export function ExternalSearchSection({ 
  filters,
  onFilterChange 
}: ExternalSearchSectionProps) {
  useGoogleSearchStyles();
  const navigate = useNavigate();
  const [queryString, setQueryString] = useState<string>("");
  const [showSwipe, setShowSwipe] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

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
  } = useSwipeMatch(filters, handleMatchSuccess);

  useEffect(() => {
    const parts = [];

    if (filters.searchTerm) {
      parts.push(filters.searchTerm);
    }

    if (filters.category && filters.category !== "all") {
      parts.push(filters.category);
    }

    if (filters.location) {
      parts.push(`${filters.location}`);
    }

    if (filters.experienceLevel && filters.experienceLevel !== "all") {
      parts.push(filters.experienceLevel);
    }

    if (filters.remoteType && filters.remoteType !== "all") {
      parts.push(filters.remoteType === "remote" ? "télétravail" : filters.remoteType);
    }

    setQueryString(parts.join(" "));
  }, [filters]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between gap-4 px-4">
        <Button
          variant="outline"
          className="lg:hidden bg-background/60 hover:bg-background/80 border-border/50"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </Button>

        <div className="flex items-center gap-4 ml-auto">
          <Button
            variant="outline"
            onClick={() => setShowSwipe(!showSwipe)}
            className="gap-2 bg-background/60 hover:bg-background/80 border-border/50"
          >
            {showSwipe ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
            {showSwipe ? 'Voir la liste' : 'Mode Swipe'}
          </Button>

          <Button
            onClick={() => navigate('/jobs/create')}
            className="gap-2 bg-[#9b87f5] hover:bg-[#8A76F3] text-white"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Créer une annonce</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className={`lg:w-80 shrink-0 lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <JobFiltersPanel 
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </aside>

        <main className="flex-1">
          <div className="space-y-8">
            {/* Google Search Integration */}
            <div className="relative bg-background/60 backdrop-blur-sm rounded-lg p-6 border border-border/50">
              <div className="absolute top-2 left-2 z-10">
                <AISearchSuggestions onSuggestionClick={(suggestion) => {
                  const searchInput = document.querySelector('.gsc-input-box input') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.value = suggestion;
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                    
                    setTimeout(() => {
                      const searchButton = document.querySelector('.gsc-search-button-v2') as HTMLButtonElement;
                      if (searchButton) {
                        searchButton.click();
                      }
                    }, 300);
                  }
                }} />
              </div>
              <div className="pl-32">
                <GoogleSearchBox />
              </div>
            </div>

            {/* Job Listings */}
            {showSwipe ? (
              <div className="relative w-full max-w-lg mx-auto aspect-[3/4]">
                {loading ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9b87f5]"></div>
                  </div>
                ) : jobs.length === 0 ? (
                  <SwipeEmptyState onRefresh={() => fetchJobs()} />
                ) : (
                  <>
                    <div className="relative w-full">
                      {jobs.map((job, index) => {
                        if (index < currentIndex) return null;
                        
                        const isTop = index === currentIndex;
                        const isDraggable = isTop && !isAnimating;
                        
                        return (
                          <AnimatedJobCard
                            key={job.id}
                            job={job}
                            x={isTop ? x : undefined}
                            rotate={isTop ? rotate : undefined}
                            opacity={isTop ? opacity : undefined}
                            scale={isTop ? scale : undefined}
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
              </div>
            ) : (
              <div className="mt-8">
                <ScrapedJobsList queryString={queryString} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Google Search Results */}
      <div className="mt-8 bg-background/60 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden">
        <div className="gcse-searchresults-only"></div>
      </div>
    </motion.div>
  );
}
