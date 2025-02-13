
import { motion } from "framer-motion";
import { BriefcaseIcon, MapPin, Building2, Search, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrapedJobsList } from "./jobs/ScrapedJobsList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        <div className="container relative py-20 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center space-y-4"
          >
            <h1 className="text-4xl font-bold tracking-tight">
              Trouvez votre prochain{" "}
              <span className="text-primary">emploi de rêve</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Des milliers d'opportunités professionnelles vous attendent. Utilisez nos outils intelligents pour trouver le poste parfait.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un poste, une entreprise..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </Button>
              <Button onClick={() => navigate("/jobs/create")}>
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                Publier
              </Button>
            </div>
          </div>

          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Recherche par lieu</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Entreprises vérifiées</span>
            </div>
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="h-4 w-4" />
              <span>Emplois de qualité</span>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List Section */}
      <section className="container py-8">
        <ScrapedJobsList queryString={searchQuery} />
      </section>
    </div>
  );
}
