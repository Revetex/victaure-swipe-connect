import { Plus, SlidersHorizontal, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SwipeMatch } from "./SwipeMatch";
import { CreateJobForm } from "./jobs/CreateJobForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { JobFilters } from "./jobs/JobFilterUtils";

export function SwipeJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    category: "all",
    duration: "all",
    salaryRange: [300, 1000],
    experienceLevel: "all",
    location: "",
    searchTerm: ""
  });

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

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
                <SelectItem value="Technology">Technologie</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Construction">Construction</SelectItem>
                <SelectItem value="Manual">Manuel</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-foreground mb-4">
              Rémunération (CAD/jour)
            </label>
            <Slider
              defaultValue={filters.salaryRange}
              max={1000}
              min={300}
              step={50}
              onValueChange={(value) => handleFilterChange("salaryRange", value)}
              className="mt-2"
            />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{filters.salaryRange[0]} CAD</span>
              <span>{filters.salaryRange[1]} CAD</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <SwipeMatch filters={filters} />
      </div>
    </div>
  );
}