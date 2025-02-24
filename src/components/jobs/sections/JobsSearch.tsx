
import { Search, Filter, Plus, Image, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobsFilters } from "./JobsFilters";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface JobsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
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
  onReset: () => void;
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
  onRemoteOnlyChange,
  onReset
}: JobsSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      initial="hidden"
      animate="visible"
      className="sticky top-20 z-10 mb-6"
    >
      <Card className={cn(
        "transition-all duration-300 border-primary/10 bg-card/50 backdrop-blur-sm shadow-lg",
        isExpanded ? "p-6" : "p-3"
      )}>
        {!isExpanded ? (
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="flex-1 justify-start h-10 text-muted-foreground hover:text-foreground"
              onClick={() => setIsExpanded(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Publier une annonce...
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary">
                  <Filter className="h-4 w-4" />
                  Filtres
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
                  onSalaryRangeChange={onSalaryRange}
                  onRemoteOnlyChange={onRemoteOnlyChange}
                  onReset={onReset}
                />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Créer une publication</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                Réduire
              </Button>
            </div>

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
                <Textarea 
                  placeholder="Décrivez votre offre en détail..." 
                  className="min-h-[100px]"
                />
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

              <div className="flex items-center gap-4 pt-4">
                <Button variant="outline" className="w-full sm:w-auto gap-2">
                  <Image className="h-4 w-4" />
                  Ajouter une image
                </Button>
                <Button className="w-full sm:w-auto gap-2">
                  <Send className="h-4 w-4" />
                  Publier
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
