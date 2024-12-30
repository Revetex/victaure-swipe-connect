import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import { useMotionValue, useTransform, motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedJobCard } from "./jobs/AnimatedJobCard";
import { JobFilters, applyJobFilters } from "./jobs/JobFilterUtils";
import { Job } from "@/types/job";

interface SwipeMatchProps {
  filters: JobFilters;
}

export function SwipeMatch({ filters }: SwipeMatchProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const dragConstraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Calculate scale based on x motion value
  const scale = useTransform(
    x,
    [-200, 0, 200],
    [0.95, 1, 0.95]
  );

  const fetchJobs = async () => {
    try {
      let query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      query = applyJobFilters(query, filters);
      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        const formattedJobs = data.map(job => ({
          id: job.id,
          title: job.title,
          company: "Company Name",
          location: job.location,
          salary: `${job.budget} CAD`,
          duration: job.contract_type,
          skills: job.required_skills || ["Skill 1", "Skill 2"],
          category: job.category,
          contract_type: job.contract_type,
          experience_level: job.experience_level
        }));
        setJobs(formattedJobs);
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Erreur lors du chargement des offres");
    }
  };

  useEffect(() => {
    fetchJobs();

    const channel = supabase
      .channel('public:jobs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'jobs'
        },
        (payload) => {
          console.log('Nouvelle mission reçue:', payload);
          const newJob = payload.new;
          setJobs(prevJobs => [{
            id: newJob.id,
            title: newJob.title,
            company: "Company Name",
            location: newJob.location,
            salary: `${newJob.budget} CAD`,
            duration: newJob.contract_type,
            skills: newJob.required_skills || ["Skill 1", "Skill 2"],
            category: newJob.category,
            contract_type: newJob.contract_type,
            experience_level: newJob.experience_level
          }, ...prevJobs]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = async (event: any, info: any) => {
    setIsDragging(false);
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 800) {
      setSwipeDirection("right");
      await handleSwipe("right");
    } else if (offset < -100 || velocity < -800) {
      setSwipeDirection("left");
      await handleSwipe("left");
    } else {
      x.set(0);
    }
  };

  const handleSwipe = async (direction: "left" | "right") => {
    if (direction === "right") {
      try {
        const { data: profile } = await supabase.auth.getUser();
        if (profile.user) {
          const { error } = await supabase.from("matches").insert({
            job_id: jobs[currentIndex].id,
            professional_id: profile.user.id,
            status: "pending"
          });

          if (error) throw error;
          toast.success("Match! Vous avez liké cette offre", {
            position: "top-center",
          });
        }
      } catch (error) {
        console.error("Error creating match:", error);
        toast.error("Erreur lors de la création du match");
      }
    }

    setTimeout(() => {
      if (currentIndex < jobs.length - 1) {
        setCurrentIndex(prev => prev + 1);
        x.set(0);
        setSwipeDirection(null);
      } else {
        toast.info("Plus d'offres disponibles pour le moment", {
          position: "top-center",
        });
      }
    }, 200);
  };

  if (jobs.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4">
          Aucune offre disponible pour le moment
        </h3>
        <p className="text-muted-foreground">
          Revenez plus tard pour découvrir de nouvelles missions.
        </p>
      </motion.div>
    );
  }

  if (currentIndex >= jobs.length) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold mb-4">
          Vous avez vu toutes les offres !
        </h3>
        <p className="text-muted-foreground mb-6">
          Revenez plus tard pour découvrir de nouvelles missions.
        </p>
        <Button
          onClick={() => {
            setCurrentIndex(0);
            fetchJobs();
          }}
          className="bg-victaure-blue hover:bg-victaure-blue/90 text-white"
        >
          Recommencer
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dragConstraintsRef}>
      <AnimatePresence>
        <motion.div
          key={currentIndex}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ 
            x: swipeDirection === "left" ? -200 : swipeDirection === "right" ? 200 : 0,
            opacity: 0,
            transition: { duration: 0.2 }
          }}
          transition={{ duration: 0.3 }}
        >
          <AnimatedJobCard
            job={jobs[currentIndex]}
            x={x}
            rotate={rotate}
            opacity={opacity}
            scale={scale}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            dragConstraints={dragConstraintsRef}
            isDragging={isDragging}
          />
        </motion.div>
      </AnimatePresence>
      
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="lg"
          className="border-destructive text-destructive hover:bg-destructive/10 transition-all duration-200 shadow-sm"
          onClick={() => handleSwipe("left")}
        >
          <ThumbsDown className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-sm"
          onClick={() => handleSwipe("right")}
        >
          <ThumbsUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}