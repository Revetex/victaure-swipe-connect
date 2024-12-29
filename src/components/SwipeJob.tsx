import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { createMatch } from "@/utils/matchUtils";
import { JobSwipeCard } from "./jobs/JobSwipeCard";
import { LoadingState, NoJobsState, NoMoreJobsState } from "./jobs/JobSwipeStates";
import type { Job } from "@/types/job";

export function SwipeJob() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['available-jobs'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: jobs, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .neq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error);
        return [];
      }

      return jobs as Job[];
    }
  });

  const handleSwipe = async (jobId: string, action: 'accept' | 'reject') => {
    if (action === 'accept') {
      await createMatch(jobId);
    }
    setCurrentIndex(prev => prev + 1);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!jobs || jobs.length === 0) {
    return <NoJobsState />;
  }

  if (currentIndex >= jobs.length) {
    return <NoMoreJobsState onRestart={() => setCurrentIndex(0)} />;
  }

  const currentJob = jobs[currentIndex];

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentJob.id}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-xl"
        >
          <JobSwipeCard job={currentJob} />
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center gap-2">
        {jobs.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-primary"
                : index < currentIndex
                ? "w-1.5 bg-primary/30"
                : "w-1.5 bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="text-destructive hover:text-destructive"
          onClick={() => handleSwipe(currentJob.id, 'reject')}
        >
          Passer
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={() => handleSwipe(currentJob.id, 'accept')}
        >
          Postuler
        </Button>
      </div>
    </div>
  );
}