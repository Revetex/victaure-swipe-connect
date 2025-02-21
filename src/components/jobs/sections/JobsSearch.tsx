
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobsFilters } from "./JobsFilters";

interface JobsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  // Ajout des props nécessaires pour les filtres
  selectedLocation: string;
  selectedCompanyType: string;
  sortOrder: "recent" | "salary";
  experienceLevel: string;
  contractType: string;
  locations: string[];
  salaryRange: [number, number];
  remoteOnly: boolean;
  onLocationChange: (value: string) => void;
  onCompanyTypeChange: (value: string) => void;
  onSortOrderChange: (value: "recent" | "salary") => void;
  onExperienceLevelChange: (value: string) => void;
  onContractTypeChange: (value: string) => void;
  onSalaryRangeChange: (value: [number, number]) => void;
  onRemoteOnlyChange: (value: boolean) => void;
}

export function JobsSearch({ 
  searchQuery, 
  onSearchChange,
  selectedLocation,
  selectedCompanyType,
  sortOrder,
  experienceLevel,
  contractType,
  locations,
  salaryRange,
  remoteOnly,
  onLocationChange,
  onCompanyTypeChange,
  onSortOrderChange,
  onExperienceLevelChange,
  onContractTypeChange,
  onSalaryRangeChange,
  onRemoteOnlyChange
}: JobsSearchProps) {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
    >
      <Card className="p-6 shadow-lg border-primary/10 bg-card/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Rechercher par titre, entreprise ou mot-clé..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-12 text-base bg-background/50 border-primary/20"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="gap-2 h-12 border-primary/20 hover:border-primary">
                <Filter className="h-5 w-5" />
                Filtres avancés
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Filtres avancés</DialogTitle>
              </DialogHeader>
              <JobsFilters
                selectedLocation={selectedLocation}
                selectedCompanyType={selectedCompanyType}
                sortOrder={sortOrder}
                experienceLevel={experienceLevel}
                contractType={contractType}
                locations={locations}
                salaryRange={salaryRange}
                remoteOnly={remoteOnly}
                onLocationChange={onLocationChange}
                onCompanyTypeChange={onCompanyTypeChange}
                onSortOrderChange={onSortOrderChange}
                onExperienceLevelChange={onExperienceLevelChange}
                onContractTypeChange={onContractTypeChange}
                onSalaryRangeChange={onSalaryRangeChange}
                onRemoteOnlyChange={onRemoteOnlyChange}
              />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 h-12">
                <Plus className="h-5 w-5" />
                Publier une annonce
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Publier une nouvelle annonce</DialogTitle>
              </DialogHeader>
              <JobPostingForm />
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </motion.div>
  );
}

// Créons le formulaire pour ajouter une annonce
interface JobPostingFormProps {}

function JobPostingForm({}: JobPostingFormProps) {
  return (
    <form className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label>Type d'annonce</Label>
          <Select defaultValue="job">
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le type d'annonce" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="job">Offre d'emploi</SelectItem>
              <SelectItem value="service">Service</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Titre</Label>
          <Input placeholder="Titre de votre annonce" />
        </div>

        <div className="grid gap-2">
          <Label>Description</Label>
          <Textarea placeholder="Décrivez votre offre en détail..." className="min-h-[100px]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Localisation</Label>
            <Input placeholder="Ville, région..." />
          </div>

          <div className="grid gap-2">
            <Label>Salaire / Budget</Label>
            <Input type="number" placeholder="Montant" />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <DialogClose asChild>
            <Button variant="outline">Annuler</Button>
          </DialogClose>
          <Button type="submit">Publier l'annonce</Button>
        </div>
      </div>
    </form>
  );
}
