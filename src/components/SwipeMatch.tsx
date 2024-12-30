import { useState, useRef } from "react";
import { toast } from "sonner";
import { motion, useMotionValue } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedJobCard } from "./jobs/AnimatedJobCard";
import { JobFilters } from "./jobs/JobFilterUtils";
import { useJobSwipe } from "@/hooks/useJobSwipe";
import { SwipeControls } from "./jobs/SwipeControls";
import { Loader2 } from "lucide-react";

interface SwipeMatchProps {
  filters: JobFilters;
}

export function SwipeMatch({ filters }: SwipeMatchProps) {
  const { jobs, currentIndex, setCurrentIndex, fetchJobs, isLoading } = useJobSwipe(filters);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const x = useMotionValue(0);
  const dragConstraintsRef = useRef(null);

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
    if (!jobs[currentIndex]) return;

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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-victaure-blue" />
        <p className="mt-2 text-muted-foreground">Chargement des offres...</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
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
        <button
          onClick={() => {
            setCurrentIndex(0);
            fetchJobs();
          }}
          className="bg-victaure-blue hover:bg-victaure-blue/90 text-white px-4 py-2 rounded"
        >
          Recommencer
        </button>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto" ref={dragConstraintsRef}>
      {jobs[currentIndex] && (
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
            rotate={x}
            opacity={x}
            scale={x}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            dragConstraints={dragConstraintsRef}
            isDragging={isDragging}
          />
        </motion.div>
      )}
      
      <SwipeControls onSwipe={handleSwipe} />
    </div>
  );
}