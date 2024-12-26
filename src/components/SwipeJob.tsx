import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Briefcase } from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
}

const mockJobs: Job[] = [
  {
    id: 1,
    title: "Développeur Full Stack",
    company: "Tech Solutions",
    location: "Paris",
    salary: "500-600€ / jour",
    description: "Nous recherchons un développeur Full Stack expérimenté...",
  },
  {
    id: 2,
    title: "Lead Developer",
    company: "Digital Agency",
    location: "Lyon",
    salary: "600-700€ / jour",
    description: "Rejoignez notre équipe en tant que Lead Developer...",
  },
];

export function SwipeJob() {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const currentJob = mockJobs[currentJobIndex];

  const handleSwipe = (like: boolean) => {
    if (currentJobIndex < mockJobs.length - 1) {
      setCurrentJobIndex(prev => prev + 1);
    }
  };

  return (
    <div className="bg-victaure-metal/20 rounded-lg p-6 border border-victaure-blue/20 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 text-victaure-blue mb-6">
        <Briefcase className="h-5 w-5" />
        <h2 className="text-lg font-semibold">SwipeJob</h2>
      </div>

      {currentJob && (
        <Card className="bg-victaure-dark/30 border-victaure-blue/20">
          <CardHeader>
            <CardTitle>{currentJob.title}</CardTitle>
            <div className="text-sm text-victaure-gray">
              {currentJob.company} • {currentJob.location}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-victaure-blue font-semibold mb-2">
              {currentJob.salary}
            </div>
            <p className="text-sm text-victaure-gray">
              {currentJob.description}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-victaure-orange hover:bg-victaure-orange/20"
          onClick={() => handleSwipe(false)}
        >
          <ThumbsDown className="h-5 w-5 text-victaure-orange" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full border-victaure-blue hover:bg-victaure-blue/20"
          onClick={() => handleSwipe(true)}
        >
          <ThumbsUp className="h-5 w-5 text-victaure-blue" />
        </Button>
      </div>
    </div>
  );
}