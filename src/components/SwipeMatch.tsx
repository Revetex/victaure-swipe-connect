import { useState } from "react";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";

const mockJobs = [
  {
    title: "Développeur Frontend React",
    company: "Tech Solutions SA",
    location: "Paris, France",
    salary: "€500-600/jour",
    duration: "3 mois",
    skills: ["React", "TypeScript", "Tailwind"],
  },
  {
    title: "UX Designer Senior",
    company: "Design Studio",
    location: "Lyon, France",
    salary: "€450-550/jour",
    duration: "6 mois",
    skills: ["Figma", "Adobe XD", "Prototyping"],
  },
  {
    title: "DevOps Engineer",
    company: "Cloud Services",
    location: "Remote",
    salary: "€600-700/jour",
    duration: "CDI",
    skills: ["AWS", "Docker", "Kubernetes"],
  },
];

export function SwipeMatch() {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    if (direction === "right") {
      toast.success(`Vous avez liké "${mockJobs[currentJobIndex].title}"`);
    } else {
      toast.info(`Vous avez passé "${mockJobs[currentJobIndex].title}"`);
    }
    
    setTimeout(() => {
      if (currentJobIndex < mockJobs.length - 1) {
        setCurrentJobIndex(prev => prev + 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  if (currentJobIndex >= mockJobs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Vous avez vu toutes les opportunités !
        </h3>
        <p className="text-victaure-gray-dark mb-6">
          Revenez plus tard pour découvrir de nouvelles missions.
        </p>
        <Button
          onClick={() => setCurrentJobIndex(0)}
          className="bg-victaure-blue hover:bg-blue-600 text-white transition-colors"
        >
          Recommencer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className={`relative w-full max-w-md transition-transform duration-300 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <JobCard {...mockJobs[currentJobIndex]} />
      </div>
      
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          className="border-victaure-red text-victaure-red hover:bg-victaure-red/10 transition-colors"
          onClick={() => handleSwipe("left")}
          disabled={isAnimating}
        >
          <ThumbsDown className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          className="bg-victaure-green hover:bg-green-600 text-white transition-colors"
          onClick={() => handleSwipe("right")}
          disabled={isAnimating}
        >
          <ThumbsUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}