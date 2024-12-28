import { Plus, SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SwipeMatch } from "./SwipeMatch";
import { CreateJobForm } from "./jobs/CreateJobForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { JobFilters } from "./jobs/JobFilterUtils";
import { missionCategories } from "@/types/job";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    category: "all",
    subcategory: "all",
    duration: "all",
    experienceLevel: "all",
    location: "",
    searchTerm: ""
  });

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    if (key === "category" && value !== filters.category) {
      // Reset subcategory when category changes
      setFilters(prev => ({ ...prev, [key]: value, subcategory: "all" }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const subcategories = filters.category !== "all" ? missionCategories[filters.category]?.subcategories : [];

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold">Offres disponibles</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="button-enhanced" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une offre
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer une nouvelle offre</DialogTitle>
            </DialogHeader>
            <CreateJobForm onSuccess={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card p-4 rounded-lg space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="h-5 w-5 text-victaure-blue" />
          <h3 className="font-semibold">Filtres</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une offre..."
                className="pl-8"
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Catégorie
            </label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {Object.keys(missionCategories).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filters.category !== "all" && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sous-catégorie
              </label>
              <Select
                value={filters.subcategory}
                onValueChange={(value) => handleFilterChange("subcategory", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les sous-catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sous-catégories</SelectItem>
                  {subcategories?.map((subcat) => (
                    <SelectItem key={subcat} value={subcat}>
                      {subcat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Durée
            </label>
            <Select
              value={filters.duration}
              onValueChange={(value) => handleFilterChange("duration", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les durées" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les durées</SelectItem>
                <SelectItem value="3-6">3-6 mois</SelectItem>
                <SelectItem value="6-12">6-12 mois</SelectItem>
                <SelectItem value="12+">12+ mois</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Niveau d'expérience
            </label>
            <Select
              value={filters.experienceLevel}
              onValueChange={(value) => handleFilterChange("experienceLevel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tous les niveaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Mid-Level">Intermédiaire</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Localisation
            </label>
            <Input
              placeholder="Ville ou région"
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <SwipeMatch filters={filters} />
      </div>
    </div>
  );
}