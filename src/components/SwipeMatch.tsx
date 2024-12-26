import { useState } from "react";
import { JobCard } from "./JobCard";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const DUMMY_JOBS = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Tech Corp",
    location: "Paris, France",
    salary: "€65,000 - €85,000",
    duration: "Full-time",
    skills: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "UX Designer",
    company: "Design Studio",
    location: "Lyon, France",
    salary: "€45,000 - €60,000",
    duration: "Contract",
    skills: ["Figma", "User Research", "Prototyping"],
  },
];

export function SwipeMatch() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: "left" | "right") => {
    if (currentIndex < DUMMY_JOBS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (currentIndex >= DUMMY_JOBS.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center p-4">
        <h3 className="text-2xl font-semibold text-victaure-gray-dark mb-4">
          No more jobs to show
        </h3>
        <p className="text-victaure-gray-dark mb-6">
          Check back later for new opportunities
        </p>
        <Button
          onClick={() => setCurrentIndex(0)}
          className="bg-victaure-blue hover:bg-blue-600"
        >
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <JobCard {...DUMMY_JOBS[currentIndex]} />
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full border-2 border-victaure-red hover:bg-victaure-red hover:text-white"
          onClick={() => handleSwipe("left")}
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-12 w-12 rounded-full border-2 border-victaure-green hover:bg-victaure-green hover:text-white"
          onClick={() => handleSwipe("right")}
        >
          <Check className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}