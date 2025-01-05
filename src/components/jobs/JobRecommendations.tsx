import { useQuery } from "@tanstack/react-query";
import { getJobRecommendations } from "@/services/ai/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function JobRecommendations() {
  const { data: recommendations = [], isLoading, error } = useQuery({
    queryKey: ["jobRecommendations"],
    queryFn: getJobRecommendations,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false
  });

  if (error) {
    toast.error("Erreur lors du chargement des recommandations");
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommandations personnalisées</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((job) => (
              <Card key={job.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <p className="text-sm">{job.location}</p>
                    <div className="mt-2">
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        Match: {Math.round(job.score)}%
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir détails
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Aucune recommandation pour le moment
          </p>
        )}
      </CardContent>
    </Card>
  );
}