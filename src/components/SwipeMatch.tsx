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

export function SwipeMatch() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);
  const dragConstraintsRef = useRef(null);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

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
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Erreur lors du chargement des offres");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []); // No more filter dependencies

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
          Revenez plus tard pour découvrir de nouvelles missions.
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
          Revenez plus tard pour découvrir de nouvelles missions.
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