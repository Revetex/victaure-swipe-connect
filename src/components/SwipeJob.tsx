import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Job } from "@/types/job";
import { useProfile } from "@/hooks/useProfile";
import { SwipeEmptyState } from "./jobs/swipe/SwipeEmptyState";
import { SwipeControls } from "./jobs/swipe/SwipeControls";
import { useSwipeJobs } from "@/hooks/useSwipeJobs";
import { JobFilters } from "./jobs/JobFilterUtils";

const defaultFilters: JobFilters = {
  category: "all",
  subcategory: "all",
  duration: "all",
  experienceLevel: "all",
  location: "",
  province: "",
  remoteType: "all",
  minBudget: 300,
  maxBudget: 1000,
  skills: [],
  searchTerm: "",
  createdAfter: null,
  createdBefore: null,
  deadlineBefore: null
};

export function SwipeJob() {
  const { profile } = useProfile();
  const [filters] = useState<JobFilters>(defaultFilters);
  const { jobs, currentIndex, handleSwipe, loading } = useSwipeJobs(filters);

  const handleLike = async () => {
    try {
      const job = jobs[currentIndex];
      const { error } = await supabase.from("matches").insert({
        job_id: job.id,
        professional_id: profile?.id,
        employer_id: job.employer_id,
        status: "pending",
        match_score: 0,
      });

      if (error) {
        toast.error("Erreur lors du like");
        throw error;
      }

      handleSwipe("right");
    } catch (error) {
      console.error("Error liking job:", error);
      toast.error("Une erreur est survenue");
    }
  };

  const handleDislike = async () => {
    try {
      const job = jobs[currentIndex];
      const { error } = await supabase.from("matches").insert({
        job_id: job.id,
        professional_id: profile?.id,
        employer_id: job.employer_id,
        status: "rejected",
        match_score: 0,
      });

      if (error) {
        console.error("Error inserting match:", error);
        handleSwipe("left");
        return;
      }

      handleSwipe("left");
    } catch (error) {
      console.error("Error disliking job:", error);
      toast.error("Une erreur est survenue");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!jobs?.length || currentIndex >= jobs.length) {
    return <SwipeEmptyState onRefresh={() => window.location.reload()} />;
  }

  const currentJob = jobs[currentIndex];

  return (
    <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={currentJob.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 p-4"
        >
          <Card className="w-full h-full overflow-y-auto p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">{currentJob.title}</h3>
              <p className="text-muted-foreground">{currentJob.company}</p>
              <p className="text-sm text-muted-foreground">{currentJob.location}</p>
            </div>
            <div className="prose prose-sm dark:prose-invert">
              <p>{currentJob.description}</p>
            </div>
            {currentJob.required_skills && currentJob.required_skills.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Compétences requises</h4>
                <div className="flex flex-wrap gap-2">
                  {currentJob.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      <SwipeControls onSwipe={handleSwipe} isAnimating={false} />
    </div>
  );
}