import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Clock, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Job } from "@/types/job";

export function SwipeJob() {
  const { toast } = useToast();
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
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les offres",
        });
        return [];
      }

      return jobs as Job[];
    }
  });

  const handleSwipe = async (jobId: string, action: 'accept' | 'reject') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (action === 'accept') {
      const { error } = await supabase
        .from('matches')
        .insert({
          job_id: jobId,
          professional_id: user.id,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating match:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de postuler à cette offre",
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Vous avez postulé à cette offre",
      });
    }

    setCurrentIndex(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Briefcase className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucune offre disponible</h3>
        <p className="text-sm text-center">
          Revenez plus tard pour découvrir de nouvelles opportunités
        </p>
      </div>
    );
  }

  if (currentIndex >= jobs.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Clock className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-semibold mb-2">C'est tout pour le moment!</h3>
        <p className="text-sm text-center">
          Vous avez vu toutes les offres disponibles
        </p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => setCurrentIndex(0)}
        >
          Recommencer
        </Button>
      </div>
    );
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
          <Card className="w-full bg-card shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{currentJob.title}</h2>
                  <div className="flex items-center text-muted-foreground mt-1">
                    <Building2 className="h-4 w-4 mr-1" />
                    <span className="text-sm">Entreprise XYZ</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {currentJob.contract_type}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {currentJob.category}
                </Badge>
                {currentJob.subcategory && (
                  <Badge variant="secondary" className="text-xs">
                    {currentJob.subcategory}
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {currentJob.experience_level}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{currentJob.location}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {new Intl.NumberFormat('fr-CA', {
                      style: 'currency',
                      currency: 'CAD'
                    }).format(currentJob.budget)}
                  </span>
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {currentJob.description}
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between gap-4 pt-6">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 text-destructive hover:text-destructive"
                onClick={() => handleSwipe(currentJob.id, 'reject')}
              >
                Passer
              </Button>
              <Button
                variant="default"
                size="lg"
                className="flex-1"
                onClick={() => handleSwipe(currentJob.id, 'accept')}
              >
                Postuler
              </Button>
            </CardFooter>
          </Card>
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
    </div>
  );
}