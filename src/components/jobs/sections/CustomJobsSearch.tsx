
import { useState } from "react";
import { Search, Filter, X, Building2, MapPin, ChevronDown, Briefcase, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { JobsFilters } from "./JobsFilters";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface CustomJobsSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
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

export function CustomJobsSearch({
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
}: CustomJobsSearchProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Calculate total active filters count
  const activeFiltersCount = [
    selectedLocation,
    selectedCompanyType,
    experienceLevel,
    contractType,
    remoteOnly,
    salaryRange[0] > 0 || salaryRange[1] < 200000
  ].filter(Boolean).length;
  
  // Clear search input
  const handleClearSearch = () => {
    onSearchChange("");
  };

  // Reset all filters
  const handleResetFilters = () => {
    onLocationChange("");
    onCompanyTypeChange("");
    onSortOrderChange("recent");
    onExperienceLevelChange("");
    onContractTypeChange("");
    onSalaryRangeChange([0, 200000]);
    onRemoteOnlyChange(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-background dark:bg-[#1B2A4A]/90 backdrop-blur-sm border border-[#64B5D9]/20 shadow-lg">
        <CardContent className="p-6">
          {/* Search header */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground dark:text-white">
              Recherche d'emploi
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Trouvez l'emploi idéal parmi nos nombreuses offres
            </p>
          </div>
          
          {/* Main search */}
          <div className="grid gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Titre, mots-clés ou entreprise..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className={cn(
                  "pl-12 pr-10 py-6",
                  "h-14",
                  "text-base",
                  "rounded-lg",
                  "border-[#64B5D9]/20",
                  "bg-background/50 dark:bg-background/10",
                  "shadow-sm",
                  "placeholder:text-muted-foreground/70",
                  "focus:border-[#64B5D9]/40 focus:ring-2 focus:ring-[#64B5D9]/20",
                  "transition-all duration-200"
                )}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            {/* Filters row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Location filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-12 justify-between bg-background/50 dark:bg-background/10 border-[#64B5D9]/20"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#64B5D9]" />
                      <span>{selectedLocation || "Lieu"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-4" align="start">
                  <div className="space-y-2">
                    <h3 className="font-medium">Localisation</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Nantes", "Lille"].map((location) => (
                        <Button 
                          key={location}
                          variant={selectedLocation === location ? "default" : "outline"}
                          size="sm"
                          className="justify-start h-9"
                          onClick={() => onLocationChange(location)}
                        >
                          {location}
                        </Button>
                      ))}
                      <Button 
                        variant={!selectedLocation ? "default" : "outline"}
                        size="sm"
                        className="justify-start h-9"
                        onClick={() => onLocationChange("")}
                      >
                        Tous les lieux
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Company type filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-12 justify-between bg-background/50 dark:bg-background/10 border-[#64B5D9]/20"
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#64B5D9]" />
                      <span>{selectedCompanyType === "internal" ? "Victaure" : selectedCompanyType === "external" ? "Externe" : "Type d'entreprise"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-4" align="start">
                  <div className="space-y-2">
                    <h3 className="font-medium">Type d'entreprise</h3>
                    <div className="grid gap-2">
                      <Button 
                        variant={selectedCompanyType === "internal" ? "default" : "outline"}
                        size="sm"
                        className="justify-start h-9"
                        onClick={() => onCompanyTypeChange("internal")}
                      >
                        Victaure
                      </Button>
                      <Button 
                        variant={selectedCompanyType === "external" ? "default" : "outline"}
                        size="sm"
                        className="justify-start h-9"
                        onClick={() => onCompanyTypeChange("external")}
                      >
                        Externe
                      </Button>
                      <Button 
                        variant={!selectedCompanyType ? "default" : "outline"}
                        size="sm"
                        className="justify-start h-9"
                        onClick={() => onCompanyTypeChange("")}
                      >
                        Toutes les entreprises
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Contract type filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-12 justify-between bg-background/50 dark:bg-background/10 border-[#64B5D9]/20"
                  >
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-[#64B5D9]" />
                      <span>{contractType || "Type de contrat"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60 p-4" align="start">
                  <div className="space-y-2">
                    <h3 className="font-medium">Type de contrat</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {["CDI", "CDD", "Freelance", "Stage", "Alternance"].map((type) => (
                        <Button 
                          key={type}
                          variant={contractType === type ? "default" : "outline"}
                          size="sm"
                          className="justify-start h-9"
                          onClick={() => onContractTypeChange(type)}
                        >
                          {type}
                        </Button>
                      ))}
                      <Button 
                        variant={!contractType ? "default" : "outline"}
                        size="sm"
                        className="justify-start h-9"
                        onClick={() => onContractTypeChange("")}
                      >
                        Tous les contrats
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* More filters button */}
            <div className="flex justify-between items-center">
              <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative text-muted-foreground hover:text-foreground hover:bg-transparent px-0"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Plus de filtres</span>
                    {activeFiltersCount > 0 && (
                      <Badge 
                        className="ml-2 h-5 min-w-5 px-1.5 py-0 flex items-center justify-center"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="start">
                  <JobsFilters
                    selectedLocation={selectedLocation}
                    selectedCompanyType={selectedCompanyType}
                    sortOrder={sortOrder}
                    experienceLevel={experienceLevel}
                    contractType={contractType}
                    locations={["Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse"]}
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
                </PopoverContent>
              </Popover>
              
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
            
            {/* Remote toggle */}
            <div className="flex items-center justify-start">
              <Button
                variant={remoteOnly ? "default" : "outline"}
                size="sm"
                onClick={() => onRemoteOnlyChange(!remoteOnly)}
                className={cn(
                  "gap-2",
                  remoteOnly ? "bg-[#64B5D9] hover:bg-[#64B5D9]/90" : "bg-transparent"
                )}
              >
                <Clock className="h-4 w-4" />
                {remoteOnly ? "Télétravail ✓" : "Télétravail uniquement"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
