import { useState } from "react";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";

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

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      console.log("Liked job:", mockJobs[currentJobIndex].title);
    } else {
      console.log("Passed on job:", mockJobs[currentJobIndex].title);
    }
    
    if (currentJobIndex < mockJobs.length - 1) {
      setCurrentJobIndex(prev => prev + 1);
    }
  };

  if (currentJobIndex >= mockJobs.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Vous avez vu toutes les opportunités !
        </h3>
        <p className="text-victaure-gray-dark mb-6">
          Revenez plus tard pour découvrir de nouvelles missions.
        </p>
        <Button
          onClick={() => setCurrentJobIndex(0)}
          className="bg-victaure-blue hover:bg-blue-600 text-white"
        >
          Recommencer
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-full max-w-md">
        <JobCard {...mockJobs[currentJobIndex]} />
      </div>
      
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="lg"
          className="border-victaure-red text-victaure-red hover:bg-victaure-red/10"
          onClick={() => handleSwipe("left")}
        >
          <ThumbsDown className="h-5 w-5" />
        </Button>
        <Button
          size="lg"
          className="bg-victaure-green hover:bg-green-600 text-white"
          onClick={() => handleSwipe("right")}
        >
          <ThumbsUp className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}