import { useState, useRef, useEffect } from "react";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  skills: string[];
  category: string;
  contract_type: string;
  experience_level: string;
}

interface SwipeMatchProps {
  filters: {
    category: string;
    subcategory: string;
    duration: string;
    salaryRange: number[];
  };
}

export function SwipeMatch({ filters }: SwipeMatchProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const dragConstraintsRef = useRef(null);

  const fetchJobs = async () => {
    try {
      let query = supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      // Add salary range filter
      if (filters.salaryRange) {
        query = query
          .gte("budget", filters.salaryRange[0])
          .lte("budget", filters.salaryRange[1]);
      }

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
          skills: ["Skill 1", "Skill 2"],
          category: job.category,
          contract_type: job.contract_type,
          experience_level: job.experience_level
        }));
        setJobs(formattedJobs);
        setCurrentIndex(0); // Reset index when new jobs are fetched
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Erreur lors du chargement des offres");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]); // Re-fetch when filters change

  const handleDragEnd = async (event: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 100 || velocity > 800) {
      await controls.start({ x: 200, opacity: 0 });
      handleSwipe("right");
    } else if (offset < -100 || velocity < -800) {
      await controls.start({ x: -200, opacity: 0 });
      handleSwipe("left");
    } else {
      controls.start({ x: 0, opacity: 1 });
    }
  };

  const handleSwipe = async (direction: "left" | "right") => {
    if (direction === "right") {
      // Handle match
      try {
        const { data: profile } = await supabase.auth.getUser();
        if (profile.user) {
          const { error } = await supabase.from("matches").insert({
            job_id: jobs[currentIndex].id,
            professional_id: profile.user.id,
            status: "pending"
          });

          if (error) throw error;
          toast.success("Match! Vous avez liké cette offre");
        }
      } catch (error) {
        console.error("Error creating match:", error);
        toast.error("Erreur lors de la création du match");
      }
    }

    // Move to next card
    if (currentIndex < jobs.length - 1) {
      setCurrentIndex(prev => prev + 1);
      controls.set({ x: 0, opacity: 1 });
    } else {
      toast.info("Plus d'offres disponibles pour le moment");
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">
          Aucune offre disponible pour le moment
        </h3>
        <p className="text-muted-foreground">
          Essayez de modifier vos filtres ou revenez plus tard.
        </p>
      </div>
    );
  }

  if (currentIndex >= jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">
          Vous avez vu toutes les offres !
        </h3>
        <p className="text-muted-foreground mb-6">
          Modifiez vos filtres ou revenez plus tard pour découvrir de nouvelles missions.
        </p>
        <Button
          onClick={() => {
            setCurrentIndex(0);
            fetchJobs();
          }}
        >
          Recommencer
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dragConstraintsRef}>
      <motion.div
        drag="x"
        dragConstraints={dragConstraintsRef}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, rotate, opacity }}
        className="cursor-grab active:cursor-grabbing"
      >
        <JobCard {...jobs[currentIndex]} />
      </motion.div>
      
      <div className="flex justify-center gap-4 mt-4">
        <Button
          variant="outline"
          size="lg"
          className="border-destructive text-destructive hover:bg-destructive/10 transition-all duration-200"
          onClick={() => handleSwipe("left")}
        >
          <ThumbsDown className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white transition-all duration-200"
          onClick={() => handleSwipe("right")}
        >
          <ThumbsUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
