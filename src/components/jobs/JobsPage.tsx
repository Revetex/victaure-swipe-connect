
import { useState } from "react";
import { JobList } from "./JobList";
import { Job } from "@/types/job";
import { useJobsData } from "@/hooks/useJobsData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Briefcase, Filter, MapPin, Building2, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function JobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCompanyType, setSelectedCompanyType] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"recent" | "salary">("recent");
  const { data: jobs = [], isLoading } = useJobsData();
  const [selectedJobId, setSelectedJobId] = useState<string>();

  const filteredJobs = jobs
    .filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation = !selectedLocation || 
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesCompanyType = !selectedCompanyType || 
        (selectedCompanyType === "internal" ? job.source === "internal" : job.source === "external");

      return matchesSearch && matchesLocation && matchesCompanyType;
    })
    .sort((a, b) => {
      if (sortOrder === "recent") {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
      const aMaxSalary = a.salary_max || a.salary_min || 0;
      const bMaxSalary = b.salary_max || b.salary_min || 0;
      return bMaxSalary - aMaxSalary;
    });

  const locations = Array.from(new Set(jobs.map(job => job.location))).sort();

  const handleJobSelect = (job: Job) => {
    setSelectedJobId(job.id);
    toast.info("Détails de l'emploi disponibles bientôt !");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto p-4 max-w-7xl"
    >
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div 
          className="flex flex-col space-y-4"
          variants={itemVariants}
        >
          <div className="flex items-center justify-start gap-3">
            <Briefcase className="h-8 w-8 text-primary shrink-0" />
            <h1 className="text-3xl font-bold tracking-tight truncate">Offres d'emploi</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Trouvez votre prochain emploi parmi {jobs.length} offres sélectionnées
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 shadow-lg border-primary/10 bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Rechercher par titre, entreprise ou mot-clé..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base bg-background/50 border-primary/20"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
              <Button variant="outline" size="lg" className="gap-2 h-12 border-primary/20 hover:border-primary">
                <Filter className="h-5 w-5" />
                Filtres avancés
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Filters Section */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm text-muted-foreground"
              >
                <option value="">Toutes les localisations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCompanyType}
                onChange={(e) => setSelectedCompanyType(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm text-muted-foreground"
              >
                <option value="">Tous les types d'entreprises</option>
                <option value="internal">Entreprises Victaure</option>
                <option value="external">Entreprises externes</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "recent" | "salary")}
                className="bg-transparent border-none focus:ring-0 text-sm text-muted-foreground"
              >
                <option value="recent">Plus récents</option>
                <option value="salary">Meilleurs salaires</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div variants={itemVariants} className="min-h-[60vh]">
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">Liste</TabsTrigger>
              <TabsTrigger value="grid">Grille</TabsTrigger>
              <TabsTrigger value="map">Carte</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              {filteredJobs.length === 0 ? (
                <Card className="p-12 text-center border-primary/10 bg-card/50 backdrop-blur-sm">
                  <div className="max-w-md mx-auto space-y-4">
                    <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="text-2xl font-semibold">Aucun emploi trouvé</h3>
                    <p className="text-muted-foreground text-lg">
                      Essayez de modifier vos critères de recherche ou revenez plus tard pour voir de nouvelles offres
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedLocation("");
                        setSelectedCompanyType("");
                      }}
                      className="mt-4"
                    >
                      Réinitialiser les filtres
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">
                      {filteredJobs.length} offre{filteredJobs.length > 1 ? 's' : ''} trouvée{filteredJobs.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <JobList 
                    jobs={filteredJobs} 
                    onJobSelect={handleJobSelect}
                    selectedJobId={selectedJobId}
                  />
                </div>
              )}
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
        </motion.div>
      </div>
    </motion.div>
  );
}
