import { Search, Filter, Plus, Image, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JobsFilters } from "./JobsFilters";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "job"
  });
  const locations = ["Montréal", "Québec", "Laval", "Gatineau", "Sherbrooke", "Trois-Rivières", "Longueuil", "Saint-Jean-sur-Richelieu", "Lévis", "Saguenay"];

  // Gestion de la soumission du formulaire
  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    toast.success("Votre annonce a été publiée avec succès");
    setIsDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      location: "",
      salary: "",
      type: "job"
    });
  };

  // Mise à jour des champs du formulaire
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Animation pour les transitions de dialogue
  const dialogVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      scale: 1
    }
  };
  return <Card className="bg-background dark:bg-[#1B2A4A]/50 backdrop-blur-sm border-border/10 dark:border-[#64B5D9]/10 shadow-lg p-6 px-[8px] py-[8px]">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)} className="flex-1 justify-start h-14 bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#7E69AB] text-transparent">
                <Plus className="w-5 h-5 mr-2" />
                Publier une annonce
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background dark:bg-[#1A1F2C] text-foreground dark:text-white border-border dark:border-[#64B5D9]/10 w-full max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Créer une publication</DialogTitle>
              </DialogHeader>
              <motion.div className="space-y-6 py-6" initial="hidden" animate="visible" variants={dialogVariants} transition={{
              duration: 0.3
            }}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Type d'annonce</Label>
                    <Select value={formData.type} onValueChange={value => handleFormChange("type", value)}>
                      <SelectTrigger className="h-12 bg-white dark:bg-[#1B2A4A] border-input/20 dark:border-[#64B5D9]/10">
                        <SelectValue placeholder="Sélectionnez le type d'annonce" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="job">Offre d'emploi</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Titre</Label>
                    <Input placeholder="Titre de votre annonce" className="h-12 bg-white dark:bg-[#1B2A4A] border-input/20 dark:border-[#64B5D9]/10" value={formData.title} onChange={e => handleFormChange("title", e.target.value)} />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-sm font-medium">Description</Label>
                    <Textarea placeholder="Décrivez votre offre en détail..." className="min-h-[200px] bg-white dark:bg-[#1B2A4A] border-input/20 dark:border-[#64B5D9]/10 resize-none" value={formData.description} onChange={e => handleFormChange("description", e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium">Localisation</Label>
                      <Input placeholder="Ville, région..." className="h-12 bg-white dark:bg-[#1B2A4A] border-input/20 dark:border-[#64B5D9]/10" value={formData.location} onChange={e => handleFormChange("location", e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-sm font-medium">Salaire / Budget</Label>
                      <Input type="number" placeholder="Montant" className="h-12 bg-white dark:bg-[#1B2A4A] border-input/20 dark:border-[#64B5D9]/10" value={formData.salary} onChange={e => handleFormChange("salary", e.target.value)} />
                    </div>
                  </div>

                  <DialogFooter className="flex justify-end gap-2 pt-6">
                    <DialogClose asChild>
                      <Button variant="outline" className="h-12 px-6 bg-white hover:bg-gray-50 dark:bg-[#1B2A4A] dark:hover:bg-[#2A3B61] border-input/20 dark:border-[#64B5D9]/10" onClick={() => setIsDialogOpen(false)}>
                        Annuler
                      </Button>
                    </DialogClose>
                    <Button className="h-12 px-6 bg-primary hover:bg-primary/90 dark:bg-[#9b87f5] dark:hover:bg-[#7E69AB]" onClick={handleSubmit}>
                      <Send className="h-4 w-4 mr-2" />
                      Publier
                    </Button>
                  </DialogFooter>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-14 w-14 shrink-0 bg-white dark:bg-[#1B2A4A] border-input/20 dark:border-[#64B5D9]/10 hover:bg-gray-50 dark:hover:bg-[#2A3B61]">
                <Filter className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <JobsFilters selectedLocation={selectedLocation} selectedCompanyType={selectedCompanyType} sortOrder={sortOrder} experienceLevel={experienceLevel} contractType={contractType} salaryRange={salaryRange} remoteOnly={remoteOnly} onLocationChange={onLocationChange} onCompanyTypeChange={onCompanyTypeChange} onSortOrderChange={onSortOrderChange} onExperienceLevelChange={onExperienceLevelChange} onContractTypeChange={onContractTypeChange} onSalaryRangeChange={onSalaryRangeChange} onRemoteOnlyChange={onRemoteOnlyChange} locations={locations} />
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Ajout d'une barre de recherche avec animation */}
        <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2
      }} className="relative">
          <Input className="h-12 pl-10 pr-4 bg-white dark:bg-[#1B2A4A]/70 border-input/20 dark:border-[#64B5D9]/10" placeholder="Rechercher des offres..." value={searchQuery} onChange={e => onSearchChange(e.target.value)} />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        </motion.div>
      </div>
    </Card>;
}