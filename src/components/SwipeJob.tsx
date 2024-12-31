import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeJobs } from "./jobs/hooks/useSwipeJobs";
import { SwipeControls } from "./jobs/swipe/SwipeControls";
import { SwipeEmptyState } from "./jobs/swipe/SwipeEmptyState";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  MapPin, 
  Calendar, 
  Briefcase, 
  Clock,
  Building2,
  GraduationCap,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SwipeJob() {
  const { 
    currentJob,
    isLoading,
    handleSwipeLeft,
    handleSwipeRight,
    error 
  } = useSwipeJobs();

  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = async (direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (direction === 'left') {
      await handleSwipeLeft();
    } else {
      await handleSwipeRight();
    }
    
    setSwipeDirection(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <XCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Une erreur est survenue</h3>
        <p className="text-muted-foreground">
          Impossible de charger les missions. Veuillez réessayer plus tard.
        </p>
      </div>
    );
  }

  if (!currentJob) {
    return <SwipeEmptyState />;
  }

  return (
    <div className="relative h-full flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentJob.id}
          className="flex-1 p-6"
          initial={{ opacity: 0, x: swipeDirection === 'left' ? -100 : swipeDirection === 'right' ? 100 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ 
            opacity: 0, 
            x: swipeDirection === 'left' ? 100 : swipeDirection === 'right' ? -100 : 0,
            transition: { duration: 0.3 }
          }}
        >
          <Card className="h-full overflow-auto glass-card">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-bold">{currentJob.title}</h2>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {currentJob.contract_type}
                  </Badge>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>{currentJob.company}</span>
                </div>
              </div>

              {/* Key Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{currentJob.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{currentJob.salary}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span>{currentJob.experience_level}</span>
                </div>
                {currentJob.application_deadline && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Date limite: {new Date(currentJob.application_deadline).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {currentJob.description}
                </p>
              </div>

              {/* Skills */}
              {currentJob.required_skills && currentJob.required_skills.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Compétences requises</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentJob.required_skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Skills */}
              {currentJob.preferred_skills && currentJob.preferred_skills.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Compétences souhaitées</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentJob.preferred_skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="border-primary/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="p-6 border-t bg-background/50 backdrop-blur-sm">
        <SwipeControls
          onSwipeLeft={() => handleSwipe('left')}
          onSwipeRight={() => handleSwipe('right')}
        />
      </div>
    </div>
  );
}