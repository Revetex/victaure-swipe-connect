import { Search, Filter, Plus, Image, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogClose,
  DialogFooter 
} from "@/components/ui/dialog";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const locations = [
    "Montréal",
    "Québec",
    "Laval",
    "Gatineau",
    "Sherbrooke",
    "Trois-Rivières",
    "Longueuil",
    "Saint-Jean-sur-Richelieu",
    "Lévis",
    "Saguenay"
  ];

  return (
    <Card className="bg-card/50 dark:bg-[#1B2A4A]/50 backdrop-blur-sm border-border/10 dark:border-[#64B5D9]/10 shadow-lg p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="flex-1 justify-start h-14 text-primary-foreground bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#7E69AB] dark:text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Publier une annonce
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background dark:bg-[#1A1F2C] text-foreground dark:text-white border-border dark:border-[#64B5D9]/10">
              <DialogHeader>
                <DialogTitle>Créer une publication</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label>Type d'annonce</Label>
                    <Select>
                      <SelectTrigger className="bg-input dark:bg-[#1B2A4A] border-border/10 dark:border-[#64B5D9]/10">
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
                    <Input 
                      placeholder="Titre de votre annonce" 
                      className="bg-input dark:bg-[#1B2A4A] border-border/10 dark:border-[#64B5D9]/10"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Décrivez votre offre en détail..." 
                      className="min-h-[100px] bg-input dark:bg-[#1B2A4A] border-border/10 dark:border-[#64B5D9]/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Localisation</Label>
                      <Input 
                        placeholder="Ville, région..." 
                        className="bg-input dark:bg-[#1B2A4A] border-border/10 dark:border-[#64B5D9]/10"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Salaire / Budget</Label>
                      <Input 
                        type="number" 
                        placeholder="Montant" 
                        className="bg-input dark:bg-[#1B2A4A] border-border/10 dark:border-[#64B5D9]/10"
                      />
                    </div>
                  </div>

                  <DialogFooter className="sm:justify-end gap-2 pt-4">
                    <DialogClose asChild>
                      <Button variant="outline" className="bg-background dark:bg-[#1B2A4A] border-border dark:border-[#64B5D9]/10">
                        Annuler
                      </Button>
                    </DialogClose>
                    <Button className="bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#7E69AB]">
                      <Send className="h-4 w-4 mr-2" />
                      Publier
                    </Button>
                  </DialogFooter>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="h-14 w-14 shrink-0 bg-background dark:bg-[#1B2A4A] border-border dark:border-[#64B5D9]/10 hover:bg-accent dark:hover:bg-[#2A3B61]"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <JobsFilters 
                selectedLocation={selectedLocation}
                selectedCompanyType={selectedCompanyType}
                sortOrder={sortOrder}
                experienceLevel={experienceLevel}
                contractType={contractType}
                salaryRange={salaryRange}
                remoteOnly={remoteOnly}
                onLocationChange={onLocationChange}
                onCompanyTypeChange={onCompanyTypeChange}
                onSortOrderChange={onSortOrderChange}
                onExperienceLevelChange={onExperienceLevelChange}
                onContractTypeChange={onContractTypeChange}
                onSalaryRangeChange={onSalaryRangeChange}
                onRemoteOnlyChange={onRemoteOnlyChange}
                locations={locations}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}
