import { Job } from "@/types/job";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { JobList } from "../JobList";
interface JobsResultsProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
  selectedJobId?: string;
  onResetFilters: () => void;
}
export function JobsResults({
  jobs,
  onJobSelect,
  selectedJobId,
  onResetFilters
}: JobsResultsProps) {
  return <motion.div className="min-h-[60vh]" variants={{
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1
    }
  }}>
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste</TabsTrigger>
          
          <TabsTrigger value="map">Carte</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {jobs.length === 0 ? <Card className="p-12 text-center border-primary/10 bg-card/50 backdrop-blur-sm">
              <div className="max-w-md mx-auto space-y-4">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-2xl font-semibold">Aucun emploi trouvé</h3>
                <p className="text-muted-foreground text-lg">
                  Essayez de modifier vos critères de recherche ou revenez plus tard pour voir de nouvelles offres
                </p>
                <Button variant="outline" onClick={onResetFilters} className="mt-4">
                  Réinitialiser les filtres
                </Button>
              </div>
            </Card> : <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  {jobs.length} offre{jobs.length > 1 ? 's' : ''} trouvée{jobs.length > 1 ? 's' : ''}
                </p>
              </div>
              <JobList jobs={jobs} onJobSelect={onJobSelect} selectedJobId={selectedJobId} />
            </div>}
        </TabsContent>

        <TabsContent value="grid">
          <Card className="p-12 text-center border-primary/10 bg-card/50 backdrop-blur-sm">
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-2xl font-semibold">Vue grille bientôt disponible</h3>
              <p className="text-muted-foreground">
                Nous travaillons sur une vue en grille pour un meilleur aperçu des offres d'emploi.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="map">
          <Card className="p-12 text-center border-primary/10 bg-card/50 backdrop-blur-sm">
            <div className="max-w-md mx-auto space-y-4">
              <h3 className="text-2xl font-semibold">Carte interactive bientôt disponible</h3>
              <p className="text-muted-foreground">
                Visualisez les offres d'emploi sur une carte interactive pour trouver les opportunités près de chez vous.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>;
}