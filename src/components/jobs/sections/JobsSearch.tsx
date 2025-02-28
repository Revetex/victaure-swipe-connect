
import { Search, Filter, Plus, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
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
  const locations = ["Montréal", "Québec", "Laval", "Gatineau", "Sherbrooke", "Trois-Rivières", "Longueuil", "Saint-Jean-sur-Richelieu", "Lévis", "Saguenay"];
  
  return (
    <Card className="bg-background/70 dark:bg-[#1B2A4A]/20 backdrop-blur-sm border-border/5 dark:border-[#64B5D9]/5 shadow-none p-2 mb-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Rechercher un emploi..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9 bg-transparent border-input/20 dark:border-[#64B5D9]/10 focus:border-primary/30 rounded-md"
          />
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-9 justify-center px-3 font-normal text-muted-foreground text-xs bg-white/5 dark:bg-[#1B2A4A]/20 hover:bg-white/10 dark:hover:bg-[#1B2A4A]/30 rounded-md"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>Publier</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background dark:bg-[#1A1F2C] text-foreground dark:text-white border-border dark:border-[#64B5D9]/10 w-full max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium">Publier une annonce</DialogTitle>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label className="text-sm font-normal text-muted-foreground">Type d'annonce</Label>
                  <Select>
                    <SelectTrigger className="h-9 bg-white/10 dark:bg-[#1B2A4A]/30 border-input/10 dark:border-[#64B5D9]/5">
                      <SelectValue placeholder="Sélectionnez le type d'annonce" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="job">Offre d'emploi</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-normal text-muted-foreground">Titre</Label>
                  <Input placeholder="Titre de votre annonce" className="h-9 bg-white/10 dark:bg-[#1B2A4A]/30 border-input/10 dark:border-[#64B5D9]/5" />
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-normal text-muted-foreground">Description</Label>
                  <Textarea placeholder="Décrivez votre offre en détail..." className="min-h-[120px] bg-white/10 dark:bg-[#1B2A4A]/30 border-input/10 dark:border-[#64B5D9]/5 resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm font-normal text-muted-foreground">Localisation</Label>
                    <Input placeholder="Ville, région..." className="h-9 bg-white/10 dark:bg-[#1B2A4A]/30 border-input/10 dark:border-[#64B5D9]/5" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm font-normal text-muted-foreground">Salaire / Budget</Label>
                    <Input type="number" placeholder="Montant" className="h-9 bg-white/10 dark:bg-[#1B2A4A]/30 border-input/10 dark:border-[#64B5D9]/5" />
                  </div>
                </div>

                <DialogFooter className="flex justify-end gap-2 pt-4">
                  <DialogClose asChild>
                    <Button variant="ghost" className="h-8 text-xs bg-transparent hover:bg-white/5 dark:hover:bg-[#1B2A4A]/30 border-none">
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button className="h-8 text-xs bg-primary/90 hover:bg-primary dark:bg-[#9b87f5]/90 dark:hover:bg-[#9b87f5]">
                    <Send className="h-3 w-3 mr-1.5" />
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
              className="h-9 w-9 shrink-0 bg-white/5 dark:bg-[#1B2A4A]/20 border-input/10 dark:border-[#64B5D9]/5 hover:bg-white/10 dark:hover:bg-[#1B2A4A]/30"
            >
              <Filter className="h-3.5 w-3.5 text-muted-foreground/70" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-background dark:bg-[#1A1F2C] text-foreground dark:text-white border-border/10 dark:border-[#64B5D9]/10">
            <DialogHeader>
              <DialogTitle className="text-lg font-medium">Filtres de recherche</DialogTitle>
            </DialogHeader>
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
    </Card>
  );
}
